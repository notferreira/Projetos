# --- 1. Importando as bibliotecas ---
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

# --- 2. Carregando e Preparando os Dados (Simulados) ---
# Em um caso real, você carregaria seu grande arquivo CSV aqui.
# pd.read_csv('dados_do_forno.csv')

dados_simulados = {
    'temp_z1': [950, 951, 952, 980, 982, 949, 950, 990, 995],
    'pressao_interna': [10.1, 10.0, 10.2, 11.5, 11.8, 10.0, 10.1, 12.0, 12.5],
    'consumo_gas': [50, 51, 50, 55, 56, 50, 51, 58, 60],
    'lote_com_defeito': [0, 0, 0, 1, 1, 0, 0, 1, 1]
}
df = pd.DataFrame(dados_simulados)

# --- 3. Engenharia de Features Simples ---
# Criando uma feature de "Média Móvel" para a temperatura
# A window=2 aqui é só para exemplo, na prática seria maior (ex: 10 para 10 minutos)
df['temp_z1_media_movel'] = df['temp_z1'].rolling(window=2).mean()

# Criando uma feature de "instabilidade" da pressão
df['pressao_std_movel'] = df['pressao_interna'].rolling(window=2).std()

# Removemos linhas com valores nulos que foram criadas pelas janelas móveis
df.dropna(inplace=True)

print("--- Dados com Novas Features (Inteligentes) ---")
print(df.head())
print("\n")

# --- 4. Separando Features (X) e Alvo (y) ---
# Agora usamos nossas features inteligentes também!
X = df[['temp_z1', 'pressao_interna', 'consumo_gas', 'temp_z1_media_movel', 'pressao_std_movel']]
y = df['lote_com_defeito']

# Dividindo em dados de treino e teste
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
# --- 5. Treinando o Modelo de IA ---
# RandomForest é uma ótima escolha para começar.
modelo_forno_ia = RandomForestClassifier(n_estimators=100, random_state=42)

print("--- Treinando o modelo de IA para o forno... ---")
modelo_forno_ia.fit(X_train, y_train)
print("--- Modelo treinado! ---\n")

# --- 6. Avaliando o Modelo ---
previsoes = modelo_forno_ia.predict(X_test)

print("--- Avaliação de Desempenho ---")
print(classification_report(y_test, previsoes))

# Uma Matriz de Confusão ajuda a ver onde o modelo erra.
cm = confusion_matrix(y_test, previsoes)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel('Previsto')
plt.ylabel('Verdadeiro')
plt.title('Matriz de Confusão')
plt.show()

# --- 7. Usando o modelo para prever um novo lote ---
print("\n--- Simulando dados de um novo lote em andamento ---")
dados_novo_lote = {
    'temp_z1': [992],
    'pressao_interna': [12.2],
    'consumo_gas': [59],
    # As features de média e desvio teriam que ser calculadas com base nos últimos minutos reais
    'temp_z1_media_movel': [993.5], 
    'pressao_std_movel': [0.35]
}
novo_lote_df = pd.DataFrame(dados_novo_lote)

previsao_lote = modelo_forno_ia.predict(novo_lote_df)
probabilidade_defeito = modelo_forno_ia.predict_proba(novo_lote_df)

if previsao_lote[0] == 1:
    print(f">> ALERTA DE QUALIDADE: Risco de defeito detectado!")
    print(f"   Confiança do modelo na previsão de defeito: {probabilidade_defeito[0][1]*100:.2f}%")
else:
    print(f">> PROCESSO ESTÁVEL: Baixo risco de defeito.")