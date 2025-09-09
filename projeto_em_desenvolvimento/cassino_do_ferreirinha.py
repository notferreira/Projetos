import random 
import time 
import os 

simbolos = ['🍒', '🍋', '🔔', '💎', '7️⃣']
saldo = 100
def limpar_tela():
    os.system('cls' if os.name == 'nt' else 'clear')

print('Bem-vindo ao cassino 777')
print('Como bônus você começa com 100 moedas.')

while saldo > 0:
    jogar = input('\nPressione Enter para girar (ou digite "sair" para encerrar o jogo): ')
    if jogar.lower() == 'sair':
        break

    saldo -= 10 
    
    for _ in range(10):
        matriz_temp = [[random.choice(simbolos) for _ in range(3)] for _ in range(3)]
        limpar_tela()
        print('Grirando...')
        for linha in matriz_temp:
            print('|'.join(linha))
        time.sleep(0.30)
        

    matriz = [[random.choice(simbolos) for _ in range(3)] for _ in range(3)]
    limpar_tela()
    print('Resultado final:')
    for linha in matriz: 
        print('|'.join(linha))

    ganhou = False
    for linha in matriz:
        if linha[0] == linha[1] == linha[2]:
            ganhou = True
            break
    
    if ganhou:
        print('Parabéns! Você ganhou 50 moedas!')
        saldo += 50


    else:
        print('não foi dessa vez !')

    print(f'Saldo atual: {saldo} moedas')

print('\nJogo encerrado. Obrigado por jogar !')  