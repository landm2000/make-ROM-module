// JavaScript(using jQuery-1.12.4.js)
$(function(){
  $(document).on('ready', function(){
    html = "";
    for (let gi = 0; gi < 16; gi++) {
      n = gi.toString(16); //) hex(gi);
      html += '<option value="' + n + '"'+ (n==0 ? " selected":"") +'>' + n + "</option>";
    }
    $(".select").html(html);
  });

  $("textarea").on("drop", function(e){
    e.preventDefault();
    let files = e.originalEvent.dataTransfer.files;
    // let name = file[0].
    load_file(files[0],$(this));
    let id = $(this).attr("id");
    let value3 = $(this).val();
    console.log(value3);
  });
  $("#submit").on("click",function(e){
    e.preventDefault();
    $("#modal-background").fadeIn();
    $("#modal").fadeIn();
    let mh = $('#modal').height();
    $('#up').height(mh * 10 / 100);
    $('#middle').height(mh * 70 / 100);
    $('#down').height(mh * 10 / 100);

    let modulename = $("#modulename").val()
    let datatext = make_sv(modulename);
    let filename = modulename + ".sv";
    let blob = new Blob([datatext]);
    download_file(blob, filename)

    $("#modal-background").fadeOut();
  });
  $("#close").on("click",function(e){
    e.preventDefault();
    $("#modal-background").fadeOut();
  });

});

function load_file(file,area){
  let fileReader = new FileReader();
  fileReader.onload = function(e){
    //html = e.target.result;
    let htmls = "";
    let html = "";
    let htmls1=e.target.result.split(" ");
    if(htmls1.length > 1) htmls = htmls1;
    else{
      let htmls2=e.target.result.split("\n");
      if(htmls2.length > 1) htmls = htmls2;
      else{
        let htmls3=e.target.result.split(",");
        if(htmls3.length > 1) htmls = htmls3;
      }
    }
    for(const i in htmls){
      const t = htmls[i];
      if(t.length!=0)
        html += t+ "\n";
    }
    area.html(html.trim());
  }
  fileReader.readAsText(file);
}

// アドレスの計算 : convert text to hex
function conv_text_16to10(tadr){
  let tl = tadr.length;
  let adr = 0x8000;
  if(tadr.charAt(0)=="$"){
    if(2 <= tl&& tl <=5){
      adr = parseInt(tadr.substr(1), 16);
      if(isNaN(adr)){
        console.log("Error : address is not a Hex Number ("+tadr+")"); /* エラー */ }
    }else{
      console.log("Error : address length ("+tadr+")"); /* エラー */ }
  }else{
    adr = parseInt(tadr);
    if(isNaN(adr)){
      console.log("Error : address is not a Decimal Number ("+tadr+")"); /* エラー */ }
  }
  return adr;
}
function make_sv(modulename){
  let text = "module " + modulename +" (\n"+
             "    input logic [15:0] adr,\n"+
             "    output logic [7:0] dat\n"+
             ");\n"+
             "    always_comb\n"+
             "      case (adr)\n";
  // 開始アドレスの取得 : getting start address by text
  const tsadr = $("#address1").val();
  // 開始アドレスの計算 : converting text to hex
  let sadr = conv_text_16to10(tsadr)
  // 割り込みベクタの変数 : variable of IRQ Vector
  let IRQa = sadr;
  let RESa = sadr;
  let NMIa = sadr;
  // 開始データ書き出し : exporting the first data
  const d11 = $("#data1").val();
  const d1 = d11.split("\n");
  for(const d in d1){
    text += "        16'h"+ (sadr.toString(16)).toUpperCase() +
            ": dat = 8'h"+ (d1[d].toString(16)).toUpperCase() +";\n";
    sadr++;
  }
  // 割り込みベクタアドレス : IRQ,BRK/RES/NMI Vector Address
  let eadr = 0xFFFA;
  // 割り込みベクタのデータ書き出し : export the IRQ Vector
  const d22 = $("#data4").val();
  const d2 = d22.split("\n");
  for(const d in d2){
    text += "        16'h"+ (eadr.toString(16)).toUpperCase() +
            ": dat = 8'h"+ (d2[d].toString(16)).toUpperCase() +";\n";
    eadr++;
  }
  //
  const m1 = $("#data2").val();
  const m2 = $("#data3").val();
  const md = $("#data2").val() + $("#data3").val();
  text += "// ----------------------------\n";
  text += "        default:  dat = 8'h"+md.toUpperCase()+";\n";
  text += "      endcase\n  endmodule";
  return text;
}

function download_file(blob, filename){
	let a = document.createElement( 'a' );
	a.href = window.URL.createObjectURL( blob );
	a.download = filename;
	a.click();
}