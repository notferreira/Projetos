// Definição da classe ContaBancaria
public class ContaBancaria {
    private String titular;
    private double saldo;

    // Construtor
    public ContaBancaria(String titular, double saldoInicial) {
        this.titular = titular;
        this.saldo = saldoInicial;
    }

    // Método para depositar dinheiro
    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
            System.out.println("Depositado: " + valor);
        } else {
            System.out.println("Valor inválido para depósito.");
        }
    }

    // Método para sacar dinheiro
    public void sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo -= valor;
            System.out.println("Sacado: " + valor);
        } else {
            System.out.println("Saldo insuficiente ou valor inválido.");
        }
    }

    // Método para consultar saldo
    public void consultarSaldo() {
        System.out.println("Saldo atual de " + titular + ": " + saldo);
    }

    // Programa principal
    public static void main(String[] args) {
        ContaBancaria conta = new ContaBancaria("Matheus", 1000.0);
        conta.consultarSaldo();
        conta.depositar(500);
        conta.sacar(200);
        conta.consultarSaldo();
    }
}
