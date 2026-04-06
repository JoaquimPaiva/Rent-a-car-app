import {
  get,
  onValue,
  push,
  ref,
  remove,
  set,
  type DatabaseReference,
  type Unsubscribe,
} from 'firebase/database';
import { realtimeDb } from './firebase';
import { toNumber } from './number';

export type Vehicle = {
  id: string;
  marca: string;
  modelo: string;
  matricula: string;
  ano: number;
  km: number;
  combustivel: string;
  status: string;
  notas: string;
};

export type Contract = {
  id: string;
  clienteNome: string;
  clienteNif: string;
  veiculoId: string;
  veiculoNome?: string;
  dataInicio: string;
  dataFimPrevista: string;
  valorTotal: number;
  status: string;
  notas: string;
  kmSaida: number;
  combustivelSaida: string;
};

export type ContractDetails = Contract & {
  kmEntrada?: number;
  combustivelEntrada?: string;
  danos?: string;
  notasRececao?: string;
  dataFinalizacao?: string;
};

export type Quote = {
  id: string;
  cliente: string;
  valorEstimado: number;
  status: string;
};

export type QuoteDetails = Quote & {
  clienteEmail?: string;
  clienteNif?: string;
  clienteTelefone?: string;
  clienteMorada?: string;
  clienteTipo?: string;
  veiculoId?: string;
  veiculoNome?: string;
  veiculoMatricula?: string;
  contractId?: string;
  dataOrcamento?: string;
  periodoInicio?: string;
  periodoFim?: string;
  periodoDias?: number;
  precoDiario?: number;
  taxas?: number;
  desconto?: number;
  validadeDias?: number;
  sentMethod?: string;
  sentTs?: number;
  observacoes?: string;
  createdTs?: number;
  updatedTs?: number;
};

export type DashboardStats = {
  totalVeiculos: number;
  totalContratosAbertos: number;
  totalContratosFinalizados: number;
  totalOrcamentos: number;
  contratosRecentes: Contract[];
  syncState: 'synced' | 'syncing' | 'error';
};

export type VehicleFormData = Omit<Vehicle, 'id'>;
export type ContractFormData = Omit<Contract, 'id'>;
export type QuoteFormData = Omit<Quote, 'id'>;

type Entry = Record<string, unknown>;

const NODE_VEHICLES = 'veiculos';
const NODE_CONTRACTS = 'alugueres';
const NODE_FINISHED = 'alugueres_terminados';
const NODE_QUOTES = 'orcamentos';

const asEntry = (value: unknown): Entry | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  return value as Entry;
};

const pickText = (sources: Array<Entry | undefined>, keys: string[], fallback = ''): string => {
  for (const source of sources) {
    if (!source) continue;
    for (const key of keys) {
      if (key in source) {
        const value = safeText(source[key], '');
        if (value !== '') return value;
      }
    }
  }
  return fallback;
};

const pickNumber = (sources: Array<Entry | undefined>, keys: string[], fallback = 0): number => {
  for (const source of sources) {
    if (!source) continue;
    for (const key of keys) {
      if (key in source) {
        const value = toNumber(source[key], Number.NaN);
        if (Number.isFinite(value)) return value;
      }
    }
  }
  return fallback;
};

const safeText = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

const parseVehicle = (id: string, payload: Entry | null | undefined): Vehicle => {
  const root = payload ?? undefined;
  const statusFromDisponivel =
    typeof root?.disponivel === 'boolean' ? (root.disponivel ? 'disponivel' : 'indisponivel') : '';

  return {
    id,
    marca: pickText([root], ['marca'], 'Sem marca'),
    modelo: pickText([root], ['modelo'], 'Sem modelo'),
    matricula: pickText([root], ['matricula'], 'N/A'),
    ano: pickNumber([root], ['ano'], 0),
    km: pickNumber([root], ['km', 'quilometragem', 'odometro'], 0),
    combustivel: pickText([root], ['combustivel', 'nivelCombustivel'], 'N/D'),
    status: pickText([root], ['status', 'estado'], statusFromDisponivel || 'disponivel'),
    notas: pickText([root], ['notas', 'observacoes'], ''),
  };
};

const parseContract = (id: string, payload: Entry | null | undefined): ContractDetails => {
  const root = payload ?? undefined;
  const cliente = asEntry(root?.cliente);
  const aluguer = asEntry(root?.aluguer);
  const rececao = asEntry(root?.rececao);
  const veiculo = asEntry(root?.veiculo);
  const veiculoSnapshot = asEntry(root?.veiculo_snapshot);

  const kmEntradaValue = pickNumber([root, rececao], ['kmEntrada', 'kmsEntrega'], Number.NaN);
  const combustivelEntradaValue = pickText([root, rececao], ['combustivelEntrada', 'combustivel'], '');
  const danosValue = pickText([root, rececao], ['danos', 'descDanos'], '');
  const notasRececaoValue = pickText([root, rececao], ['notasRececao', 'observacoes'], '');
  const dataFinalizacaoValue = pickText([root, rececao], ['dataFinalizacao', 'dataRececao', 'createdAt'], '');
  const vehicleMarca = pickText([veiculoSnapshot, veiculo, root], ['marca'], '');
  const vehicleModelo = pickText([veiculoSnapshot, veiculo, root], ['modelo'], '');
  const vehicleLabel = `${vehicleMarca} ${vehicleModelo}`.trim();

  return {
    id,
    clienteNome: pickText([root, cliente], ['clienteNome', 'nome'], 'Cliente sem nome'),
    clienteNif: pickText([root, cliente], ['clienteNif', 'nif'], ''),
    veiculoId: pickText([root, veiculo], ['veiculoId', 'id'], ''),
    veiculoNome: vehicleLabel || undefined,
    dataInicio: pickText([root, aluguer], ['dataInicio'], ''),
    dataFimPrevista: pickText([root, aluguer], ['dataFimPrevista', 'dataFim'], ''),
    valorTotal: pickNumber([root, aluguer], ['valorTotal', 'valor_total', 'valorDiario'], 0),
    status: pickText([root, aluguer], ['status'], 'aberto'),
    notas: pickText([root], ['notas', 'observacoes'], ''),
    kmSaida: pickNumber([root, veiculo], ['kmSaida', 'quilometragem', 'odometro'], 0),
    combustivelSaida: pickText([root, veiculo], ['combustivelSaida', 'nivelCombustivel', 'combustivel'], ''),
    kmEntrada: Number.isFinite(kmEntradaValue) ? kmEntradaValue : undefined,
    combustivelEntrada: combustivelEntradaValue || undefined,
    danos: danosValue || undefined,
    notasRececao: notasRececaoValue || undefined,
    dataFinalizacao: dataFinalizacaoValue || undefined,
  };
};

const parseQuote = (id: string, payload: Entry | null | undefined): Quote => {
  const root = payload ?? undefined;
  const cliente = asEntry(root?.cliente);

  return {
    id,
    cliente: pickText([root, cliente], ['clienteNome', 'nome', 'cliente'], 'Cliente'),
    valorEstimado: pickNumber([root], ['valorEstimado', 'valor_total'], 0),
    status: pickText([root], ['status'], 'pendente'),
  };
};

const parseQuoteDetails = (id: string, payload: Entry | null | undefined): QuoteDetails => {
  const root = payload ?? undefined;
  const cliente = asEntry(root?.cliente);
  const periodo = asEntry(root?.periodo);
  const veiculoSnapshot = asEntry(root?.veiculo_snapshot);
  const periodoDias = pickNumber([periodo], ['dias'], Number.NaN);
  const precoDiario = pickNumber([root], ['preco_diario'], Number.NaN);
  const taxas = pickNumber([root], ['taxas'], Number.NaN);
  const desconto = pickNumber([root], ['desconto'], Number.NaN);
  const validadeDias = pickNumber([root], ['validade_dias'], Number.NaN);
  const sentTs = pickNumber([root], ['sent_ts'], Number.NaN);
  const createdTs = pickNumber([root], ['created_ts'], Number.NaN);
  const updatedTs = pickNumber([root], ['updated_ts'], Number.NaN);
  const vehicleMarca = pickText([veiculoSnapshot], ['marca'], '');
  const vehicleModelo = pickText([veiculoSnapshot], ['modelo'], '');
  const vehicleLabel = `${vehicleMarca} ${vehicleModelo}`.trim();

  return {
    ...parseQuote(id, payload),
    clienteEmail: pickText([cliente], ['email'], '') || undefined,
    clienteNif: pickText([cliente], ['nif'], '') || undefined,
    clienteTelefone: pickText([cliente], ['telefone'], '') || undefined,
    clienteMorada: pickText([cliente], ['morada'], '') || undefined,
    clienteTipo: pickText([cliente], ['tipo'], '') || undefined,
    veiculoId: pickText([root], ['veiculoId'], '') || undefined,
    veiculoNome: vehicleLabel || undefined,
    veiculoMatricula: pickText([veiculoSnapshot], ['matricula'], '') || undefined,
    contractId: pickText([root], ['contract_id'], '') || undefined,
    dataOrcamento: pickText([root], ['data_orcamento'], '') || undefined,
    periodoInicio: pickText([periodo], ['inicio'], '') || undefined,
    periodoFim: pickText([periodo], ['fim'], '') || undefined,
    periodoDias: Number.isFinite(periodoDias) ? periodoDias : undefined,
    precoDiario: Number.isFinite(precoDiario) ? precoDiario : undefined,
    taxas: Number.isFinite(taxas) ? taxas : undefined,
    desconto: Number.isFinite(desconto) ? desconto : undefined,
    validadeDias: Number.isFinite(validadeDias) ? validadeDias : undefined,
    sentMethod: pickText([root], ['sent_method'], '') || undefined,
    sentTs: Number.isFinite(sentTs) ? sentTs : undefined,
    observacoes: pickText([root], ['observacoes'], '') || undefined,
    createdTs: Number.isFinite(createdTs) ? createdTs : undefined,
    updatedTs: Number.isFinite(updatedTs) ? updatedTs : undefined,
  };
};

const fromSnapshotList = <T>(value: unknown, mapper: (id: string, payload: Entry | null | undefined) => T): T[] => {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value as Entry).map(([id, payload]) => mapper(id, payload as Entry | null | undefined));
};

const toFriendlyError = (scope: string, error: unknown): Error => {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: string }).code) : '';
  return new Error(`${scope} falhou${code ? ` (${code})` : ''}.`);
};

const readNode = async <T>(node: string, mapper: (id: string, payload: Entry | null | undefined) => T): Promise<T[]> => {
  try {
    const snapshot = await get(ref(realtimeDb, node));
    return fromSnapshotList(snapshot.val(), mapper);
  } catch (error) {
    throw toFriendlyError(`Leitura de ${node}`, error);
  }
};

const readById = async <T>(node: string, id: string, mapper: (id: string, payload: Entry | null | undefined) => T): Promise<T | null> => {
  try {
    const snapshot = await get(ref(realtimeDb, `${node}/${id}`));
    if (!snapshot.exists()) return null;
    return mapper(id, snapshot.val() as Entry);
  } catch (error) {
    throw toFriendlyError(`Leitura de ${node}/${id}`, error);
  }
};

const readRawById = async (node: string, id: string): Promise<Entry | null> => {
  try {
    const snapshot = await get(ref(realtimeDb, `${node}/${id}`));
    if (!snapshot.exists()) return null;
    const value = snapshot.val();
    return asEntry(value) ?? {};
  } catch (error) {
    throw toFriendlyError(`Leitura de ${node}/${id}`, error);
  }
};

const createInNode = async <T extends Record<string, unknown>>(node: string, payload: T): Promise<string> => {
  try {
    const dbRef = push(ref(realtimeDb, node));
    await set(dbRef, payload);
    return dbRef.key as string;
  } catch (error) {
    throw toFriendlyError(`Criacao em ${node}`, error);
  }
};

const updateInNode = async <T extends Record<string, unknown>>(node: string, id: string, payload: T): Promise<void> => {
  try {
    await set(ref(realtimeDb, `${node}/${id}`), payload);
  } catch (error) {
    throw toFriendlyError(`Atualizacao em ${node}/${id}`, error);
  }
};

const subscribeNode = <T>(
  dbRef: DatabaseReference,
  mapper: (id: string, payload: Entry | null | undefined) => T,
  onData: (list: T[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  return onValue(
    dbRef,
    (snapshot) => {
      onData(fromSnapshotList(snapshot.val(), mapper));
    },
    (error) => {
      onError?.(toFriendlyError('Subscricao realtime', error));
    },
  );
};

export const listVehiclesOnce = () => readNode(NODE_VEHICLES, parseVehicle);

export const getVehicleById = (id: string) => readById(NODE_VEHICLES, id, parseVehicle);

export const createVehicle = (data: VehicleFormData) =>
  createInNode(NODE_VEHICLES, {
    marca: safeText(data.marca),
    modelo: safeText(data.modelo),
    matricula: safeText(data.matricula),
    ano: toNumber(data.ano),
    km: toNumber(data.km),
    quilometragem: toNumber(data.km),
    odometro: toNumber(data.km),
    combustivel: safeText(data.combustivel),
    nivelCombustivel: safeText(data.combustivel),
    status: safeText(data.status, 'disponivel'),
    estado: safeText(data.status, 'disponivel'),
    disponivel: safeText(data.status, 'disponivel') === 'disponivel',
    notas: safeText(data.notas),
    observacoes: safeText(data.notas),
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    updated_ts: Date.now(),
  });

export const updateVehicle = (id: string, data: VehicleFormData) =>
  updateInNode(NODE_VEHICLES, id, {
    marca: safeText(data.marca),
    modelo: safeText(data.modelo),
    matricula: safeText(data.matricula),
    ano: toNumber(data.ano),
    km: toNumber(data.km),
    quilometragem: toNumber(data.km),
    odometro: toNumber(data.km),
    combustivel: safeText(data.combustivel),
    nivelCombustivel: safeText(data.combustivel),
    status: safeText(data.status, 'disponivel'),
    estado: safeText(data.status, 'disponivel'),
    disponivel: safeText(data.status, 'disponivel') === 'disponivel',
    notas: safeText(data.notas),
    observacoes: safeText(data.notas),
    atualizadoEm: new Date().toISOString(),
    updated_ts: Date.now(),
  });

export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    await remove(ref(realtimeDb, `${NODE_VEHICLES}/${id}`));
  } catch (error) {
    throw toFriendlyError(`Remocao em ${NODE_VEHICLES}/${id}`, error);
  }
};

export const getContractById = (id: string) => readById(NODE_CONTRACTS, id, parseContract);

export const getFinishedContractById = (id: string) => readById(NODE_FINISHED, id, parseContract);

export const createContract = (data: ContractFormData) =>
  createInNode(NODE_CONTRACTS, {
    clienteNome: safeText(data.clienteNome),
    clienteNif: safeText(data.clienteNif),
    veiculoId: safeText(data.veiculoId),
    dataInicio: safeText(data.dataInicio),
    dataFimPrevista: safeText(data.dataFimPrevista),
    valorTotal: toNumber(data.valorTotal),
    notas: safeText(data.notas),
    kmSaida: toNumber(data.kmSaida),
    combustivelSaida: safeText(data.combustivelSaida),
    status: safeText(data.status, 'aberto'),
    cliente: {
      nome: safeText(data.clienteNome),
      nif: safeText(data.clienteNif),
      email: '',
      telefone: '',
      morada: '',
      numero: '',
      tipo: '',
    },
    aluguer: {
      dataInicio: safeText(data.dataInicio),
      dataFimPrevista: safeText(data.dataFimPrevista),
      dataFim: safeText(data.dataFimPrevista),
      inicio_ts: Date.parse(safeText(data.dataInicio)) || Date.now(),
      fim_ts: Date.parse(safeText(data.dataFimPrevista)) || Date.now(),
      dias: 0,
      valorDiario: toNumber(data.valorTotal),
      status: safeText(data.status, 'aberto'),
      assinatura: '',
      assinaturaLocadora: '',
    },
    rececao: {},
    observacoes: safeText(data.notas),
    veiculo: {
      quilometragem: toNumber(data.kmSaida),
      nivelCombustivel: safeText(data.combustivelSaida),
    },
    createdAt: new Date().toISOString(),
    created_ts: Date.now(),
    updatedAt: new Date().toISOString(),
    updated_ts: Date.now(),
  });

export const updateContract = (id: string, data: ContractFormData) =>
  updateInNode(NODE_CONTRACTS, id, {
    clienteNome: safeText(data.clienteNome),
    clienteNif: safeText(data.clienteNif),
    veiculoId: safeText(data.veiculoId),
    dataInicio: safeText(data.dataInicio),
    dataFimPrevista: safeText(data.dataFimPrevista),
    valorTotal: toNumber(data.valorTotal),
    notas: safeText(data.notas),
    kmSaida: toNumber(data.kmSaida),
    combustivelSaida: safeText(data.combustivelSaida),
    status: safeText(data.status, 'aberto'),
    cliente: {
      nome: safeText(data.clienteNome),
      nif: safeText(data.clienteNif),
      email: '',
      telefone: '',
      morada: '',
      numero: '',
      tipo: '',
    },
    aluguer: {
      dataInicio: safeText(data.dataInicio),
      dataFimPrevista: safeText(data.dataFimPrevista),
      dataFim: safeText(data.dataFimPrevista),
      inicio_ts: Date.parse(safeText(data.dataInicio)) || Date.now(),
      fim_ts: Date.parse(safeText(data.dataFimPrevista)) || Date.now(),
      dias: 0,
      valorDiario: toNumber(data.valorTotal),
      status: safeText(data.status, 'aberto'),
      assinatura: '',
      assinaturaLocadora: '',
    },
    observacoes: safeText(data.notas),
    veiculo: {
      quilometragem: toNumber(data.kmSaida),
      nivelCombustivel: safeText(data.combustivelSaida),
    },
    updatedAt: new Date().toISOString(),
    updated_ts: Date.now(),
  });

export const deleteContract = async (id: string): Promise<void> => {
  try {
    await remove(ref(realtimeDb, `${NODE_CONTRACTS}/${id}`));
  } catch (error) {
    throw toFriendlyError(`Remocao em ${NODE_CONTRACTS}/${id}`, error);
  }
};

export const createQuote = (data: QuoteFormData) =>
  createInNode(NODE_QUOTES, {
    cliente: {
      nome: safeText(data.cliente, 'Cliente'),
      nif: '',
      email: '',
      telefone: '',
      morada: '',
      tipo: '',
    },
    clienteNome: safeText(data.cliente, 'Cliente'),
    valorEstimado: toNumber(data.valorEstimado),
    valor_total: toNumber(data.valorEstimado),
    status: safeText(data.status, 'pendente'),
    created_ts: Date.now(),
    updated_ts: Date.now(),
  });

export const updateQuote = (id: string, data: QuoteFormData) =>
  updateInNode(NODE_QUOTES, id, {
    cliente: {
      nome: safeText(data.cliente, 'Cliente'),
      nif: '',
      email: '',
      telefone: '',
      morada: '',
      tipo: '',
    },
    clienteNome: safeText(data.cliente, 'Cliente'),
    valorEstimado: toNumber(data.valorEstimado),
    valor_total: toNumber(data.valorEstimado),
    status: safeText(data.status, 'pendente'),
    updated_ts: Date.now(),
  });

export const deleteQuote = async (id: string): Promise<void> => {
  try {
    await remove(ref(realtimeDb, `${NODE_QUOTES}/${id}`));
  } catch (error) {
    throw toFriendlyError(`Remocao em ${NODE_QUOTES}/${id}`, error);
  }
};

export const getQuoteById = (id: string) => readById(NODE_QUOTES, id, parseQuoteDetails);

export const finalizeContract = async (payload: {
  contractId: string;
  kmEntrada: number;
  combustivelEntrada: string;
  danos: string;
  notas: string;
}): Promise<void> => {
  const { contractId, kmEntrada, combustivelEntrada, danos, notas } = payload;

  try {
    const current = await readRawById(NODE_CONTRACTS, contractId);
    if (!current) throw new Error('Contrato nao encontrado.');

    const nowIso = new Date().toISOString();
    const nowTs = Date.now();
    const currentRececao = asEntry(current.rececao) ?? {};
    const currentAluguer = asEntry(current.aluguer) ?? {};

    const finalized: Entry = {
      ...current,
      kmEntrada: toNumber(kmEntrada),
      combustivelEntrada: safeText(combustivelEntrada),
      danos: safeText(danos),
      notasRececao: safeText(notas),
      status: 'finalizado',
      dataFinalizacao: nowIso,
      updatedAt: nowIso,
      updated_ts: nowTs,
      rececao: {
        ...currentRececao,
        kmsEntrega: toNumber(kmEntrada),
        combustivel: safeText(combustivelEntrada),
        descDanos: safeText(danos),
        observacoes: safeText(notas),
        dataRececao: nowIso,
        createdAt: nowIso,
        fim_ts: nowTs,
        temDanos: safeText(danos).trim().length > 0,
      },
      aluguer: {
        ...currentAluguer,
        status: 'finalizado',
        fim_ts: nowTs,
      },
    };

    await set(ref(realtimeDb, `${NODE_FINISHED}/${contractId}`), finalized);
    await remove(ref(realtimeDb, `${NODE_CONTRACTS}/${contractId}`));
  } catch (error) {
    if (error instanceof Error && error.message.includes('Contrato nao encontrado')) {
      throw error;
    }
    throw toFriendlyError('Finalizacao de contrato', error);
  }
};

export const subscribeVehicles = (onData: (vehicles: Vehicle[]) => void, onError?: (error: Error) => void) =>
  subscribeNode(ref(realtimeDb, NODE_VEHICLES), parseVehicle, onData, onError);

export const subscribeContracts = (onData: (contracts: Contract[]) => void, onError?: (error: Error) => void) =>
  subscribeNode(ref(realtimeDb, NODE_CONTRACTS), parseContract, onData, onError);

export const subscribeFinishedContracts = (
  onData: (contracts: ContractDetails[]) => void,
  onError?: (error: Error) => void,
) => subscribeNode(ref(realtimeDb, NODE_FINISHED), parseContract, onData, onError);

export const subscribeQuotes = (onData: (quotes: Quote[]) => void, onError?: (error: Error) => void) =>
  subscribeNode(ref(realtimeDb, NODE_QUOTES), parseQuote, onData, onError);

export const subscribeDashboardStats = (
  onData: (stats: DashboardStats) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  let vehicles: Vehicle[] = [];
  let contracts: Contract[] = [];
  let finished: ContractDetails[] = [];
  let quotes: Quote[] = [];

  const emit = (syncState: DashboardStats['syncState'] = 'synced') => {
    onData({
      totalVeiculos: vehicles.length,
      totalContratosAbertos: contracts.length,
      totalContratosFinalizados: finished.length,
      totalOrcamentos: quotes.length,
      contratosRecentes: contracts.slice(0, 5),
      syncState,
    });
  };

  const unsubs = [
    subscribeVehicles(
      (data) => {
        vehicles = data;
        emit('synced');
      },
      (error) => {
        onError?.(error);
        emit('error');
      },
    ),
    subscribeContracts(
      (data) => {
        contracts = data;
        emit('synced');
      },
      (error) => {
        onError?.(error);
        emit('error');
      },
    ),
    subscribeFinishedContracts(
      (data) => {
        finished = data;
        emit('synced');
      },
      (error) => {
        onError?.(error);
        emit('error');
      },
    ),
    subscribeQuotes(
      (data) => {
        quotes = data;
        emit('synced');
      },
      (error) => {
        onError?.(error);
        emit('error');
      },
    ),
  ];

  emit('syncing');

  return () => {
    unsubs.forEach((unsubscribe) => unsubscribe());
  };
};
