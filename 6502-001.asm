* = $F000
START JMP NEXT1
NEXT2
.WORD START
NEXT1 NOP
      JMP (NEXT2)
.END

; F000 4C 05 F0
; F003 00 F0
; F005 EA
; F006 6C 03 F0
; F009