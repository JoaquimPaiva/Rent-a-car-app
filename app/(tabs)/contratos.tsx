import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Card } from "../../components/Card";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { AppButton } from "../../components/ui/AppButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatCurrency } from "../../lib/number";
import { subscribeContracts, type Contract } from "../../lib/realtime";

export default function ContractsTab() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [list, setList] = useState<Contract[]>([]);

  useEffect(() => {
    return subscribeContracts((items) => setList(items));
  }, []);

  const toneByStatus = (status: string) => {
    if (status === "aberto") return "brand" as const;
    if (status === "finalizado") return "success" as const;
    if (status === "cancelado") return "danger" as const;
    return "warning" as const;
  };

  const statusLabel = (status: string) => {
    const normalized = (status || "").toLowerCase().trim();
    if (normalized === "aberto") return "Em curso";
    if (normalized === "finalizado") return "Finalizado";
    if (normalized === "cancelado") return "Cancelado";
    if (normalized === "pendente") return "Pendente";
    return status || "N/D";
  };

  return (
    <Screen>
      <Header title="Contratos" subtitle="Alugueres ativos" />

      <View
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: 14,
          gap: 10,
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: "800",
          }}
        >
          {list.length} contrato{list.length === 1 ? "" : "s"} em curso
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Gere abertura, rececao e acompanhamento dos alugueres a partir deste
          painel.
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <AppButton
              title="Novo Contrato"
              onPress={() => router.push("/contratos/novo")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton
              title="Registar Rececao"
              variant="secondary"
              onPress={() => router.push("/contratos/rececao")}
            />
          </View>
        </View>
      </View>

      {list.length === 0 ? (
        <EmptyState
          title="Sem contratos"
          subtitle="Crie um contrato para iniciar operacoes."
        />
      ) : (
        <View style={{ gap: 10 }}>
          {list.map((contract) => (
            <Pressable
              key={contract.id}
              onPress={() => router.push(`/contratos/detalhes/${contract.id}`)}
            >
              <Card style={{ gap: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      style={{
                        color: theme.colors.textPrimary,
                        fontWeight: "800",
                        fontSize: 16,
                      }}
                    >
                      {contract.clienteNome}
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary }}>
                      Veiculo:{" "}
                      {contract.veiculoNome ||
                        contract.veiculoId ||
                        "Nao atribuido"}
                    </Text>
                  </View>
                  <Text
                    style={{ color: theme.colors.primary, fontWeight: "800" }}
                  >
                    {formatCurrency(contract.valorTotal)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 12,
                      }}
                    >
                      Inicio
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.textPrimary,
                        fontWeight: "600",
                      }}
                    >
                      {contract.dataInicio
                        ? new Date(contract.dataInicio).toLocaleDateString()
                        : "N/D"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 12,
                      }}
                    >
                      Fim Previsto
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.textPrimary,
                        fontWeight: "600",
                      }}
                    >
                      {contract.dataFimPrevista
    ? new Date(contract.dataFimPrevista).toLocaleDateString()
    : 'N/D'}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <StatusBadge
                    label={statusLabel(contract.status)}
                    tone={toneByStatus(contract.status)}
                  />
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Toque para ver detalhes
                  </Text>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
