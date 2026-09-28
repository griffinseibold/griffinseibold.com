// Content for the interactive Homelab diagram. Every node in
// HomelabExplorer.astro has an entry here, and walkthroughs refer to nodes by id.

export type NodeInfo = {
  group: string;
  label: string;
  body: string;
};

export type Walkthrough = {
  id: string;
  label: string;
  title: string;
  steps: { nodes: string[]; text: string }[];
};

export const intro = {
  meta: 'Explore',
  title: 'Click any part of the diagram',
  body: 'Each box explains what that part does. Or pick a walkthrough to follow a request, a deploy, a log line, a chat message, or a backup through the system.',
};

export const nodes: Record<string, NodeInfo> = {
  'homelab-repo': {
    group: 'GitHub',
    label: 'Homelab repository',
    body: 'Defines the whole platform: the host setup, the cluster, and every platform component. Flux watches its main branch, so a push here is how the platform changes.',
  },
  'app-repos': {
    group: 'GitHub',
    label: 'Application repositories',
    body: "Each app keeps its code, tests, container build, and Helm chart in its own repository. The platform doesn't need to know which apps exist.",
  },
  host: {
    group: 'Host',
    label: 'Ubuntu host',
    body: 'One desktop with a Ryzen 9 3900X, 48 GB of RAM, and a Radeon RX 6900 XT with 16 GB of VRAM. An Ansible playbook installs Docker, kubectl, Helm, Kind, and the Flux CLI.',
  },
  docker: {
    group: 'Host',
    label: 'Docker',
    body: "Runs the cluster's nodes. With Kind, every Kubernetes node is an ordinary Docker container on the host.",
  },
  kind: {
    group: 'Cluster',
    label: 'Kind cluster',
    body: 'Kind ("Kubernetes in Docker") runs a three-node cluster: one control plane and two workers. Port 8080 on the loopback address and port 443 on the home-network address map into the cluster, where Envoy Gateway is listening. The workers also mount the GPU and the model files.',
  },
  flux: {
    group: 'Platform',
    label: 'Flux',
    body: 'Checks the Homelab repository every minute and applies what changed, in dependency order: the gateway first, then monitoring and Argo CD, then logging, the model server, and chat. It manages Argo CD too.',
  },
  argocd: {
    group: 'Platform',
    label: 'Argo CD',
    body: 'Deploys each application from its own repository into its own namespace, and tracks its sync status, health, and history. Its web UI is at argocd.localhost.',
  },
  envoy: {
    group: 'Platform',
    label: 'Envoy Gateway',
    body: 'The only way into the cluster. It routes each request by hostname, such as chat.localhost or hello-crud.localhost. An app gets a hostname by shipping a route in its chart.',
  },
  prometheus: {
    group: 'Platform',
    label: 'Prometheus',
    body: 'Collects metrics from anything that declares a ServiceMonitor, in any namespace, and keeps seven days of history. Alert rules watch the model server.',
  },
  alloy: {
    group: 'Platform',
    label: 'Grafana Alloy',
    body: "Runs on every node and reads every pod's logs, labeling each line with its namespace, pod, and container before sending it to Loki.",
  },
  loki: {
    group: 'Platform',
    label: 'Loki',
    body: 'Stores logs for seven days so they can be searched from Grafana.',
  },
  grafana: {
    group: 'Platform',
    label: 'Grafana',
    body: 'Dashboards for the cluster and the model server, plus log search across every app, at grafana.localhost.',
  },
  llm: {
    group: 'Platform',
    label: 'Model server',
    body: 'llama.cpp running Qwen3-8B entirely on the GPU through Vulkan, with an OpenAI-compatible API at llm.localhost. It runs as a single replica, since there is one GPU.',
  },
  webui: {
    group: 'Platform',
    label: 'Open WebUI',
    body: 'A chat interface at chat.localhost that uses the local model server as its only backend. Conversations are stored on a persistent volume.',
  },
  flipfinder: {
    group: 'Applications',
    label: 'Flip Finder',
    body: 'A Spring Boot and React app that ranks Old School RuneScape Grand Exchange flips. It pulls prices from the RuneScape Wiki every five minutes and keeps its SQLite database on a persistent volume. Argo CD deploys it from its own repository, and it answers at flipfinder.localhost.',
  },
  'hello-crud': {
    group: 'Applications',
    label: 'hello-crud',
    body: 'A small Flask API that stores its data in SQLite on a persistent volume. Argo CD deploys it from its own repository, and it answers at hello-crud.localhost.',
  },
  'any-app': {
    group: 'Applications',
    label: 'Any app with a Helm chart',
    body: 'New apps follow the same pattern as Flip Finder and hello-crud. Once registered in Argo CD, an app gets its own namespace and hostname, and its logs are collected automatically.',
  },
  browser: {
    group: 'Host',
    label: 'Browser',
    body: 'A browser on the desktop reaches everything through 127.0.0.1:8080 at .localhost names. Phones and laptops on the home network use HTTPS at .lab.internal names for the apps that opt in, such as chat and Flip Finder. Nothing is reachable from outside the home network.',
  },
  gpu: {
    group: 'Host',
    label: 'GPU',
    body: "The Radeon RX 6900 XT. Its device files are mounted into the worker nodes, so the model server's pod can reach the GPU even though Kind has no GPU plugin.",
  },
  models: {
    group: 'Host',
    label: 'Model files',
    body: 'Stored on the host disk and mounted read-only into the workers, so they survive a cluster rebuild. The download script checks a pinned SHA-256 checksum.',
  },
  backups: {
    group: 'Host',
    label: 'Backups',
    body: 'A Python tool that copies every persistent volume out of the cluster to the host with SHA-256 checksums, and can restore any of them into an empty volume.',
  },
};

export const walkthroughs: Walkthrough[] = [
  {
    id: 'request',
    label: 'A request',
    title: 'Following a request to hello-crud',
    steps: [
      {
        nodes: ['browser'],
        text: 'You open hello-crud.localhost:8080 in a browser on the desktop.',
      },
      {
        nodes: ['kind'],
        text: 'Kind maps port 8080 on the host into the cluster, where Envoy Gateway is listening.',
      },
      {
        nodes: ['envoy'],
        text: "Envoy matches the hostname to the route that hello-crud's chart created.",
      },
      {
        nodes: ['hello-crud'],
        text: 'The request reaches the hello-crud pod, which reads or writes its SQLite database on a persistent volume.',
      },
    ],
  },
  {
    id: 'deploy',
    label: 'A deploy',
    title: 'Shipping a change',
    steps: [
      {
        nodes: ['homelab-repo'],
        text: 'To change the platform, I push a commit to the Homelab repository.',
      },
      {
        nodes: ['flux'],
        text: 'Flux notices the new commit within about a minute.',
      },
      {
        nodes: ['envoy', 'argocd', 'prometheus', 'alloy', 'loki', 'grafana', 'llm', 'webui'],
        text: "Flux applies the change in dependency order and upgrades the affected Helm releases, retrying anything that isn't ready yet.",
      },
      {
        nodes: ['app-repos'],
        text: 'Apps work the same way through their own repositories. Tagging a release of an app like hello-crud or Flip Finder runs its tests and publishes a new container image.',
      },
      {
        nodes: ['argocd'],
        text: 'Argo CD syncs the app from its repository.',
      },
      {
        nodes: ['hello-crud'],
        text: "The new version rolls out in the app's own namespace, without touching the rest of the platform.",
      },
    ],
  },
  {
    id: 'logs',
    label: 'A log line',
    title: 'Following a log line',
    steps: [
      {
        nodes: ['hello-crud'],
        text: 'hello-crud writes a line to standard output, like any containerized app.',
      },
      {
        nodes: ['alloy'],
        text: 'Alloy, which runs on every node, picks up the line and labels it with the namespace, pod, and container.',
      },
      {
        nodes: ['loki'],
        text: 'Loki stores the line for seven days.',
      },
      {
        nodes: ['grafana'],
        text: 'The line is searchable in Grafana right away, with a query like {namespace="hello-crud"}.',
      },
    ],
  },
  {
    id: 'chat',
    label: 'A chat message',
    title: 'Following a chat message',
    steps: [
      {
        nodes: ['browser'],
        text: 'You send a message from the chat page at chat.localhost:8080.',
      },
      {
        nodes: ['envoy'],
        text: 'Envoy routes the chat hostname to Open WebUI.',
      },
      {
        nodes: ['webui'],
        text: "Open WebUI passes the conversation to the model server's OpenAI-compatible API.",
      },
      {
        nodes: ['llm', 'gpu', 'models'],
        text: 'llama.cpp generates the reply with Qwen3-8B on the GPU, using model files mounted read-only from the host.',
      },
      {
        nodes: ['prometheus', 'grafana'],
        text: "The model server's metrics, such as queued requests and token throughput, are scraped every 30 seconds and graphed in Grafana.",
      },
    ],
  },
  {
    id: 'backup',
    label: 'A backup',
    title: 'Taking a backup',
    steps: [
      {
        nodes: ['backups'],
        text: 'I run the backup tool on the host.',
      },
      {
        nodes: ['docker', 'kind'],
        text: "It pauses the cluster's node containers, so volumes stop changing while they're copied.",
      },
      {
        nodes: ['flipfinder', 'hello-crud', 'webui', 'grafana', 'prometheus', 'loki'],
        text: "It copies every persistent volume, including the apps' SQLite databases, Open WebUI's chats, and the monitoring data.",
      },
      {
        nodes: ['argocd'],
        text: "It exports Argo CD's application registrations, because those live in the cluster rather than in git.",
      },
      {
        nodes: ['backups'],
        text: 'The nodes resume, and the tool writes SHA-256 checksums that its verify command can re-check later.',
      },
    ],
  },
];
