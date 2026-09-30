import useSWR from "swr";

function UpdatedAt({ isLoading, data, loadingText }) {
  let updatedAtText = loadingText;
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Última atualização: {updatedAtText}</div>;
}

function StatusInfo({ isLoading, data, loadingText }) {
  let version = loadingText;
  let maxConnections = loadingText;
  let openedConnections = loadingText;

  if (!isLoading && data) {
    version = data.dependencies.database.version;
    maxConnections = data.dependencies.database.max_connections;
    openedConnections = data.dependencies.database.opened_connections;
  }

  return (
    <>
      <h3>Banco de Dados</h3>
      <ul>
        <li>Conexões abertas: {openedConnections}</li>
        <li>Conexões disponíveis: {maxConnections}</li>
        <li>Versão do PostgreSQL: {version}</li>
      </ul>
    </>
  );
}
async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}
export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 60000,
  });
  let loadingText = "Carregando...";
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt isLoading={isLoading} data={data} loadingText={loadingText} />
      <StatusInfo isLoading={isLoading} data={data} loadingText={loadingText} />
    </>
  );
}
