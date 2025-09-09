# --- 1. Importando as bibliotecas necessárias ---
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# --- 2. Preparando os Dados (O Mais Importante!) ---
# Em um cenário real, você teria um grande histórico de dados dos sensores da sua máquina.
# Aqui, vamos SIMULAR esses dados para o nosso exemplo.
# Cada linha é uma leitura de sensores em um determinado momento.

dados = {
    'vibracao_mm_s': [1.2, 1.5, 1.1, 1.8, 2.5, 4.5, 5.1, 4.8, 1.3, 1.4, 5.5, 6.2],
    'temperatura_C': [45, 47, 44, 50, 55, 75, 82, 80, 46, 48, 85, 90],
    'pressao_bar':   [150, 155, 148, 160, 170, 200, 210, 205, 152, 158, 220, 230],
    # A nossa "variável alvo": 1 significa que a máquina falhou nas 24h seguintes, 0 significa que não.
    'falha_em_24h':  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1]
}

df = pd.DataFrame(dados)

print("--- Amostra dos Dados de Treinamento ---")
print(df)
print("\n")


# --- 3. Separando os Dados para o Modelo ---
# X são as leituras dos sensores (as "features" ou características)
# y é o nosso alvo (a "label" ou rótulo), o que queremos prever.

X = df[['vibracao_mm_s', 'temperatura_C', 'pressao_bar']]
y = df['falha_em_24h']

# Dividimos os dados em um conjunto para treinar o modelo e outro para testar se ele aprendeu bem.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)


# --- 4. Treinando o Modelo de Inteligência Artificial ---
# Vamos usar um algoritmo chamado "Random Forest" (Floresta Aleatória).
# Ele é muito bom para esse tipo de problema de classificação.
# Pense nele como um comitê de "árvores de decisão" que votam no resultado final.

modelo_ia = RandomForestClassifier(n_estimators=100, random_state=42)

print("--- Treinando o modelo de IA... ---")
# O comando "fit" é o momento em que a "mágica" acontece: o modelo aprende com os dados.
modelo_ia.fit(X_train, y_train)
print("--- Modelo treinado com sucesso! ---\n")


# --- 5. Avaliando o Desempenho do Modelo ---
# Agora, vamos usar os dados de teste (que o modelo nunca viu) para ver se ele acerta as previsões.
previsoes = modelo_ia.predict(X_test)

print("--- Avaliação do Modelo ---")
print(f"Acurácia: {accuracy_score(y_test, previsoes):.2f}")
print("Relatório de Classificação:")
print(classification_report(y_test, previsoes))


# --- 6. USANDO O MODELO NA PRÁTICA (SIMULAÇÃO) ---
# Agora, a parte mais importante: integrar com a manutenção.
# Imagine que os sensores da sua prensa acabaram de enviar novas leituras.

print("\n--- Simulação de Novos Dados em Tempo Real ---")
dados_atuais_maquina = {
    'vibracao_mm_s': [5.8],
    'temperatura_C': [88.0],
    'pressao_bar':   [225.0]
}
dados_atuais_df = pd.DataFrame(dados_atuais_maquina)

# Fazendo a previsão para os dados atuais
previsao_em_tempo_real = modelo_ia.predict(dados_atuais_df)
probabilidade_de_falha = modelo_ia.predict_proba(dados_atuais_df)

print(f"Leituras atuais: Vibração={dados_atuais_maquina['vibracao_mm_s'][0]}, Temp={dados_atuais_maquina['temperatura_C'][0]}, Pressão={dados_atuais_maquina['pressao_bar'][0]}")

if previsao_em_tempo_real[0] == 1:
    # A probabilidade [:, 1] se refere à chance da classe "1" (falha).
    print(f"\n>> ALERTA DE MANUTENÇÃO! <<")
    print(f"   Previsão: POSSÍVEL FALHA NAS PRÓXIMAS 24 HORAS.")
    print(f"   Confiança do modelo na previsão de falha: {probabilidade_de_falha[0][1]*100:.2f}%")
    print(f"   Ação recomendada: Inspecionar o sistema hidráulico e os rolamentos da prensa.")
else:
    print(f"\n>> STATUS NORMAL <<")
    print(f"   Previsão: Operação normal, sem indicativo de falha iminente.")
    print(f"   Confiança do modelo na previsão de normalidade: {probabilidade_de_falha[0][0]*100:.2f}%")