import random

numero_secreto =  random.randint(1, 100)
numero_de_tentaivas = 0

print('Tente acertar o número sorteado de 1 a 100')

while True:
    chute = int(input('digite seu palpite: '))

    if chute < 1 or chute > 100:
        print('Isso não é um valor válido')
        continue

    if chute < numero_secreto:
        print('O  número secreto é maior que o digitado')
        numero_de_tentaivas += 1
    
    if chute > numero_secreto:
        print('O número secreto é menor que o digitado')
        numero_de_tentaivas += 1
    
    if chute == numero_secreto:
        print('Parabéns você acertou o número sorteado')
        numero_de_tentaivas += 1
        print(f'seu numero de tentativas: {numero_de_tentaivas} ')
        break



