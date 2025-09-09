tabuleiro = ["-", "-", "-",
             "-", "-", "-",
             "-", "-", "-",]

jogo_ativo = True

vencedor = None

jogador_atual = "X"

def imprimir_tabuleiro():
    print(tabuleiro[0] + "|" + tabuleiro[1] + "|" + tabuleiro[2])
    print("---------")
    print(tabuleiro[3] + "|" + tabuleiro[4] + "|" + tabuleiro[5])
    print("---------")
    print(tabuleiro[6] + "|" + tabuleiro[7] + "|" + tabuleiro[8])

def jogada(jogador):
    print(f'É a vez do jogador {jogador}')
    posicao = input('Escolha uma posição de 1 a 9')

    valido = False
    while not valido:
        while posicao not in ["1", "2", "3", "4", "5", "6", "7", "8", "9"]:
            posicao = input('Entrada invalida. Escolha uma posição de 1 a 9: ')
        
        posicao = int(posicao) - 1

        if tabuleiro[posicao] == '-':
            valido = True
        else:
            print('Você não pode jogar ai, tente novamente.')
            posicao = input('Escolha uma posição de 1 a 9: ')


    tabuleiro[posicao] = jogador
    imprimir_tabuleiro()

def checar_fim_de_jogo():
    checar_vitoria()
    checar_empate()

def checar_vitoria():
    
    global vencedor 
    vencedor_linha = checar_linhas()
    
    vencedor_coluna = checar_colunas()
    
    vencedor_diagonal = checar_diagonais()

    if vencedor_linha:
        vencedor = vencedor_linha

    elif vencedor_coluna:
        vencedor = vencedor_coluna
    
    elif vencedor_diagonal:
        vencedor = vencedor_diagonal

    else:
        vencedor = None

def checar_linhas():
    global jogo_ativo

    linha_1 = tabuleiro[0] == tabuleiro[1] == tabuleiro[2] != "-"
    linha_2 = tabuleiro[3] == tabuleiro[4] == tabuleiro[5] != "-"
    linha_3 = tabuleiro[6] == tabuleiro[7] == tabuleiro[8] != "-"

    if linha_1 or linha_2 or linha_3:
        jogo_ativo = False
        if linha_1:
            return tabuleiro[0]
        elif linha_2:
            return tabuleiro[3]
        elif linha_3:
            return tabuleiro[6]
    return None

def checar_colunas():
    global jogo_ativo

    coluna_1 = tabuleiro[0] == tabuleiro[3] == tabuleiro[6] != "-"
    coluna_2 = tabuleiro[1] == tabuleiro[4] == tabuleiro[7] != "-"
    coluna_3 = tabuleiro[2] == tabuleiro[5] == tabuleiro[8] != "-"
    
    if coluna_1 or coluna_2 or coluna_3:
        jogo_ativo = False
        if coluna_1:
            return tabuleiro[0]
        elif coluna_2:
            return tabuleiro[1]
        elif coluna_3:
            return tabuleiro[2]
    return None

def checar_diagonais():
    global jogo_ativo

    diagonal_1 = tabuleiro[0] == tabuleiro[4] == tabuleiro[8] != "-"
    diagonal_2 = tabuleiro[2] == tabuleiro[4] == tabuleiro[6] != "-"

    if diagonal_1 or diagonal_2:
        jogo_ativo = False
        if diagonal_1:
            return tabuleiro[0]
        elif diagonal_2:
            return tabuleiro[2]
    return None

def checar_empate():
    global jogo_ativo
    if "-" not in tabuleiro and vencedor is None:
        jogo_ativo = False
        return True
    return False

def mudar_jogador():
    global jogador_atual
    if jogador_atual == "X":
        jogador_atual = "O"
    elif jogador_atual == "O":
        jogador_atual = "X"

def jogar():
    global jogador_atual

    print('Bem-vindo ao jogo da velha')
    imprimir_tabuleiro()

    while jogo_ativo:
        jogada(jogador_atual)
        checar_fim_de_jogo()
        mudar_jogador()

    if vencedor == "X" or vencedor == "O":
        print(f'Parabéns !! O jogador {vencedor} venceu.')
    elif checar_empate():
        print('O jogo terminou empatado')

jogar()

