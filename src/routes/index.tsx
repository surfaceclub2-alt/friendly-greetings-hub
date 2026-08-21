import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import logoDark from "@/assets/dao-logo-on-dark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Start Here | Redbelly DAO Onboarding Hub" },
      {
        name: "description",
        content:
          "Start Here: the Redbelly DAO onboarding hub. Scam warning, KYC and regional restrictions, network setup, wallet fixes, trading venues, staking and the testnet faucet.",
      },
      { property: "og:title", content: "Start Here | Redbelly DAO Onboarding Hub" },
      {
        property: "og:description",
        content:
          "Scam warning, KYC, chain IDs, RPC URLs, wallet troubleshooting, trading venues, staking and the testnet faucet in one page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StartHere,
});

const TASKBOARD = "https://redbelly-dao-taskboard.vercel.app/login";
const PDF_URL =
  "https://cdn.jsdelivr.net/gh/poundeater/task17hub@main/public/Redbelly-DAO-Start-Here.pdf";
const DOCX_URL =
  "https://docs.google.com/gview?url=https://raw.githubusercontent.com/poundeater/task17hub/main/public/Redbelly-DAO-Start-Here.docx&embedded=true";

function Card({
  id,
  step,
  title,
  kicker,
  children,
}: {
  id: string;
  step: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-lg border border-border bg-card scroll-mt-20"
      aria-labelledby={`${id}-title`}
    >
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-4 sm:px-6">
        <span className="font-mono text-xs text-ink-muted">{step}</span>
        <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {kicker ? <span className="text-sm text-ink-muted">{kicker}</span> : null}
      </header>
      <div className="border-t border-border px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-accent-link underline decoration-accent-link/40 underline-offset-2 hover:decoration-accent-link"
    >
      {children}
    </a>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 border-t border-hairline pt-3 text-sm text-ink-muted">{children}</p>
  );
}


function KeyValue({
  label,
  rows,
}: {
  label: string;
  rows: { k: string; v: React.ReactNode }[];
}) {
  return (
    <div className="rounded-lg border border-hairline bg-nested p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">{label}</h3>
      <dl className="mt-3 divide-y divide-hairline">
        {rows.map((r) => (
          <div key={r.k} className="grid gap-1 py-2.5 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-sm text-ink-2">{r.k}</dt>
            <dd className="text-sm break-all">{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[0.9em]">{children}</span>;
}

const GHOST =
  "inline-flex items-center gap-2 rounded border border-border bg-card px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent-link hover:text-accent-link";

const NETWORKS = {
  mainnet: {
    chainId: "0x97",
    chainName: "Redbelly Network Mainnet",
    rpcUrls: ["https://governors.mainnet.redbelly.network"],
    nativeCurrency: { name: "RBNT", symbol: "RBNT", decimals: 18 },
    blockExplorerUrls: ["https://redbelly.routescan.io"],
  },
  testnet: {
    chainId: "0x99",
    chainName: "Redbelly Network Testnet",
    rpcUrls: ["https://governors.testnet.redbelly.network"],
    nativeCurrency: { name: "RBNT", symbol: "RBNT", decimals: 18 },
    blockExplorerUrls: ["https://redbelly.testnet.routescan.io"],
  },
} as const;

async function addNetwork(network: keyof typeof NETWORKS) {
  const eth = (window as unknown as { ethereum?: { request: (a: unknown) => Promise<unknown> } })
    .ethereum;
  if (!eth) return false;
  try {
    await eth.request({ method: "wallet_addEthereumChain", params: [NETWORKS[network]] });
    return true;
  } catch {
    return false;
  }
}

function RpcRow({ network, url }: { network: keyof typeof NETWORKS; url: string }) {
  return (
    <button
      type="button"
      onClick={() => void addNetwork(network)}
      title="Add this network to your wallet"
      className="text-left font-mono text-[0.9em] break-all text-accent-link underline decoration-accent-link/40 underline-offset-2 hover:decoration-accent-link"
    >
      {url}
    </button>
  );
}

function AddToWallet({ network }: { network: keyof typeof NETWORKS }) {
  const [state, setState] = React.useState<"idle" | "done" | "error">("idle");

  const add = async () => {
    setState((await addNetwork(network)) ? "done" : "error");
  };

  return (
    <div className="mt-3">
      <button type="button" onClick={add} className={GHOST}>
        Add to wallet
      </button>
      {state === "done" ? (
        <p className="mt-2 text-sm text-ok">Network sent to your wallet.</p>
      ) : null}
      {state === "error" ? (
        <p className="mt-2 text-sm text-ink-muted">
          No EVM wallet detected, or the request was rejected. Add the details manually.
        </p>
      ) : null}
    </div>
  );
}

function CopyAddress({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-sm text-ink-muted">{label}</span>
      <code className="font-mono text-[0.85rem] break-all text-ink">{value}</code>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
        className="rounded border border-border bg-card px-2 py-1 text-xs font-semibold text-ink transition-colors hover:border-accent-link hover:text-accent-link"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}


function StartHere() {
  return (
    <div className="min-h-screen bg-background text-base text-foreground">
      <header className="sticky top-0 z-10 border-b border-hairline bg-background/80 backdrop-blur-[16px]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 sm:px-16">
          <a href={TASKBOARD} aria-label="Redbelly DAO task board">
            <img src={logoDark} alt="Redbelly DAO" className="h-8 w-auto sm:h-9" />
          </a>
          <a
            href="#scam-warning"
            className="rounded border border-border px-3 py-1.5 text-sm text-ink-2 hover:text-ink"
          >
            Start Here
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 pb-16 pt-8 sm:px-16 sm:pt-12">
        <div className="max-w-[68ch]">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Redbelly DAO
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-5xl">Start Here</h1>
          <p className="mt-4 text-base text-ink-2 sm:text-lg">
            This is the onboarding hub for Redbelly DAO. Read the scam warning first, then work
            down the page. Everything here is either verified against official docs or marked as
            community-verified.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {/* 1. Scam warning */}
          <section
            id="scam-warning"
            className="overflow-hidden rounded-lg border border-border bg-card scroll-mt-20"
            aria-labelledby="scam-warning-title"
          >
            <header className="flex flex-wrap items-baseline gap-x-3 bg-primary px-5 py-4 sm:px-6">
              <span className="font-mono text-xs text-[#16202a]">01</span>
              <h2
                id="scam-warning-title"
                className="text-xl font-semibold text-primary-foreground sm:text-2xl"
              >
                Scam warning
              </h2>
              <span className="rounded bg-[#ffdad7] px-2.5 py-1 text-sm font-bold text-[#16202a]">
                Read first
              </span>
            </header>
            <div className="bg-[#ffdad7] px-5 py-5 sm:px-6 sm:py-6">
              <p className="max-w-[70ch] font-semibold text-[#16202a]">
                Redbelly staff, moderators, and official support will never DM you first. Any
                direct message claiming to be from Redbelly staff, offering support, or announcing
                a giveaway is a scam, no exceptions.
              </p>
            </div>
            <div className="border-t border-border px-5 py-5 sm:px-6 sm:py-6">
              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-ink-muted">
                Common patterns to watch for
              </h3>
              <ul className="mt-3 space-y-2 text-ink-2">
                {[
                  "Unsolicited DMs offering help with a wallet or KYC issue.",
                  "Claims of a giveaway, airdrop, or reward requiring a wallet connection or seed phrase.",
                  "Anyone asking for your seed phrase, private key, or asking you to verify your wallet through a link.",
                ].map((t) => (
                  <li key={t} className="flex gap-3 max-w-[70ch]">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-destructive" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-[70ch] text-ink-2">
                Official Redbelly communication only happens through public channels: this site,
                official docs, and public Discord channels. If you are unsure whether a message is
                legitimate, do not click any link or connect your wallet. Verify in a public
                channel first.
              </p>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <a
              href={PDF_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Read PDF
            </a>
            <a
              href={DOCX_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Read Docs
            </a>
            <a
              href="https://dev.to/poundeater/building-the-redbelly-dao-start-here-onboarding-hub-2nb5"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Read Article
            </a>
          </div>

          {/* 2. KYC */}
          <Card id="kyc" step="02" title="KYC" kicker="Required for native RBNT and mainnet">
            <p className="max-w-[70ch] text-ink-2">
              KYC is required for native RBNT and mainnet activity: transactions, staking, and
              governance. It is not required to hold or trade wrapped RBNT on other chains.
            </p>
            <p className="mt-4 max-w-[70ch] text-ink-2">
              Redbelly gates its own Layer 1 behind identity verification through the Redbelly
              Access portal at <A href="https://access.redbelly.network/">access.redbelly.network</A>
              . Wrapped RBNT on Ethereum or other chains is a standard ERC-20 with no Redbelly-side
              identity check.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-hairline bg-nested p-4">
                <p className="text-sm text-ink-muted">Wallets per verified identity</p>
                <p className="mt-1 text-lg font-semibold">Up to 10 wallets</p>
              </div>
              <div className="rounded-lg border border-hairline bg-nested p-4">
                <p className="text-sm text-ink-muted">Typical approval time</p>
                <p className="mt-1 text-lg font-semibold">
                  <span className="text-ok">3 to 5 minutes</span>
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  Submissions needing manual review can take longer.
                </p>
              </div>
            </div>
            <Note>
              MOD-VERIFIED, DISCORD, NO PUBLISHED DOC: the 10-wallet limit and typical approval
              time. Source: Redbelly Individual Onboarding SDK overview,{" "}
              <A href="https://docs.redbelly.network">docs.redbelly.network</A>.
            </Note>

            <div className="mt-6 rounded-lg border border-hairline bg-nested p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-base font-semibold">
                <span className="h-2 w-2 rounded-full bg-warn" />
                Regional restrictions
              </h3>
              <p className="mt-3 max-w-[70ch] text-ink-2">
                Eighteen jurisdictions are currently restricted from accessing the Redbelly Network
                platform:
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {[
                  "Afghanistan",
                  "Central African Republic",
                  "North Korea",
                  "Democratic Republic of the Congo",
                  "Guinea-Bissau",
                  "Iran",
                  "Iraq",
                  "Lebanon",
                  "Libya",
                  "Myanmar",
                  "Russia",
                  "Somalia",
                  "South Sudan",
                  "Sudan",
                  "Syria",
                  "Ukraine",
                  "Yemen",
                  "Zimbabwe",
                ].map((c) => (
                  <li
                    key={c}
                    className="rounded border border-border px-2 py-1 text-sm text-ink-2"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-[70ch] text-ink-2">
                Anyone outside this list can proceed with KYC and mainnet access. Anyone inside it
                cannot, regardless of wallet or exchange used.
              </p>
              <Note>
                Source: Redbelly Network Terms and Conditions, Clause 15,{" "}
                <A href="https://redbelly.network/terms-and-conditions">
                  redbelly.network/terms-and-conditions
                </A>
                .
              </Note>
            </div>
          </Card>

          {/* 3. Network setup */}
          <Card id="network" step="03" title="Network setup" kicker="Mainnet 151, Testnet 153">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <KeyValue
                  label="Mainnet"
                  rows={[
                    { k: "Chain ID", v: <Mono>151</Mono> },
                    { k: "Currency symbol", v: "RBNT (18 decimals)" },
                    {
                      k: "RPC URL",
                      v: (
                        <RpcRow
                          network="mainnet"
                          url="https://governors.mainnet.redbelly.network"
                        />
                      ),
                    },
                    {
                      k: "Block explorer",
                      v: (
                        <Mono>
                          <A href="https://redbelly.routescan.io">https://redbelly.routescan.io</A>
                        </Mono>
                      ),
                    },
                  ]}
                />
                <AddToWallet network="mainnet" />
              </div>
              <div>
                <KeyValue
                  label="Testnet"
                  rows={[
                    { k: "Chain ID", v: <Mono>153</Mono> },
                    { k: "Currency symbol", v: "RBNT (18 decimals)" },
                    {
                      k: "RPC URL",
                      v: (
                        <RpcRow
                          network="testnet"
                          url="https://governors.testnet.redbelly.network"
                        />
                      ),
                    },
                    {
                      k: "Block explorer",
                      v: (
                        <Mono>
                          <A href="https://redbelly.testnet.routescan.io">
                            https://redbelly.testnet.routescan.io
                          </A>
                        </Mono>
                      ),
                    },
                  ]}
                />
                <AddToWallet network="testnet" />
              </div>
            </div>
            <p className="mt-4 max-w-[70ch] text-ink-2">
              Clicking an RPC URL or the Add to wallet button sends the network details straight to
              your wallet.
            </p>
            <p className="mt-4 max-w-[70ch] text-ink-2">
              Mainnet and testnet never share a field. Chain ID, RPC, and explorer are each unique
              to their own network.
            </p>
            <Note>
              Source: <A href="https://chainlist.org/chain/151">chainlist.org/chain/151</A>,{" "}
              <A href="https://chainlist.org/chain/153">chainlist.org/chain/153</A>, and the
              ethereum-lists/chains repository, cross-checked against a live call to the testnet
              RPC endpoint. Two testnet explorer URLs are in circulation; this draft uses the more
              recently updated one (redbelly.testnet.routescan.io). Confirm before publish.
            </Note>
          </Card>

          {/* 4. Zero balance */}
          <Card
            id="zero-balance"
            step="04"
            title="Wallet shows a zero balance"
            kicker="Almost always wRBNT, not native RBNT"
          >
            <p className="max-w-[70ch] text-ink-2">
              This is uncommon, and when it happens it is almost always about wRBNT (wrapped
              RBNT), not native RBNT. Native RBNT is the network's gas token and does not need a
              contract address added to display correctly. wRBNT does. If your wRBNT balance shows
              as zero, check in this order:
            </p>
            <ol className="mt-5 space-y-3">
              {[
                {
                  t: "Contract address",
                  d: "Confirm the wRBNT contract address is added correctly in your wallet. A missing or wrong contract address is the most common cause of a zero display.",
                  extra: (
                    <>
                      <CopyAddress
                        label="Ethereum"
                        value="0xb45ffb51984d626ee758b336c61cf20990c6bf13"
                      />
                      <CopyAddress
                        label="Base"
                        value="0x020940df9f5e77338a094d55b5b5914122a804a5"
                      />
                    </>
                  ),
                },
                {
                  t: "Try another wallet",
                  d: "If it still shows zero, check the same address in a different wallet extension, for example Rabby. If the balance appears there, the issue is with the first wallet's display, not your funds.",
                },
                {
                  t: "Check the block explorer",
                  d: "If it is still not showing, look up your wallet address directly on Routescan. If the balance is there, your funds are safe and the discrepancy is on the wallet's display side only.",
                  extra: (
                    <p className="mt-3 text-sm text-ink-2">
                      Redbelly network explorer:{" "}
                      <Mono>
                        <A href="https://redbelly.routescan.io">https://redbelly.routescan.io</A>
                      </Mono>
                    </p>
                  ),
                },
                {
                  t: "Check the source transaction",
                  d: "If the balance genuinely is not showing anywhere, including the explorer, confirm the original transfer or bridge actually executed successfully.",
                },
              ].map((s, i) => (
                <li
                  key={s.t}
                  className="flex gap-4 rounded-lg border border-hairline bg-nested p-4"
                >
                  <span className="font-mono text-sm text-accent-link">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{s.t}</p>
                    <p className="mt-1 max-w-[70ch] text-ink-2">{s.d}</p>
                    {s.extra ?? null}
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 max-w-[70ch] text-ink-2">
              A zero balance in your wallet does not mean lost funds. In almost all cases the
              tokens are on-chain and visible on the explorer. The wallet interface simply is not
              recognizing or displaying them yet.
            </p>
            <Note>
              MOD-VERIFIED, DISCORD, NO PUBLISHED DOC: this entire explainer. Source:
              contributor's own troubleshooting experience with wRBNT display issues. Not published
              in official Redbelly documentation.
            </Note>
          </Card>

          {/* 5. Buy and trade */}
          <Card id="trade" step="05" title="Where to buy and trade">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border border-hairline bg-nested p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                  Centralized exchanges
                </h3>
                <ul className="mt-3 space-y-2 text-ink-2">
                  {[
                    { n: "MEXC", h: "https://www.mexc.com" },
                    { n: "Gate.io", h: "https://www.gate.io" },
                    { n: "WhiteBit", h: "https://whitebit.com" },
                    { n: "BYDFi", h: "https://www.bydfi.com" },
                  ].map((x) => (
                    <li key={x.n}>
                      <A href={x.h}>{x.n}</A>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-hairline bg-nested p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                  Decentralized exchanges
                </h3>
                <dl className="mt-3 space-y-3 text-ink-2">
                  {[
                    {
                      label: "Ethereum Network",
                      items: [
                        {
                          n: "1inch",
                          h: "https://1inch.com/swap?src=1:0xb45ffb51984d626ee758b336c61cf20990c6bf13&dst=1:USDT",
                        },
                        {
                          n: "OKX DEX",
                          h: "https://web3.okx.com/dex-swap?chain=ethereum,ethereum&token=0xb45ffb51984d626ee758b336c61cf20990c6bf13,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                        },
                        {
                          n: "Bitget Web3",
                          h: "https://web3.bitget.com/en/swap/eth/0xb45fFB51984d626Ee758b336C61Cf20990c6bF13",
                        },
                      ],
                    },
                    {
                      label: "Base Network",
                      items: [
                        {
                          n: "KyberSwap",
                          h: "https://kyberswap.com/swap/base/0x020940df9f5e77338a094d55b5b5914122a804a5-to-usdc",
                        },
                        {
                          n: "1inch",
                          h: "https://1inch.com/swap?src=8453:0x020940df9f5e77338a094d55b5b5914122a804a5&dst=8453:USDC",
                        },
                        {
                          n: "OKX DEX",
                          h: "https://web3.okx.com/dex-swap?chain=base,base&token=0x020940df9f5e77338a094d55b5b5914122a804a5,0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca",
                        },
                        {
                          n: "Bitget Web3",
                          h: "https://web3.bitget.com/en/swap/base/0x020940df9F5E77338a094D55b5B5914122a804A5",
                        },
                      ],
                    },
                    {
                      label: "Solana Network",
                      items: [
                        {
                          n: "Raydium",
                          h: "https://raydium.io/swap/?inputMint=2GBVt2ENvbHepuJMWYTPkkfpWUabAhsaXToYw8UphxS3&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        },
                      ],
                    },
                    {
                      label: "Redbelly native",
                      items: [
                        {
                          n: "Reddex",
                          h: "https://www.reddex.io/swap?chain=redbelly&inputCurrency=NATIVE&outputCurrency=0x8201c02d4AB2214471E8C3AD6475C8b0CD9F2D06",
                        },
                      ],
                    },
                  ].map((g) => (
                    <div key={g.label}>
                      <dt className="text-sm text-ink-muted">{g.label}</dt>
                      <dd className="mt-1 flex flex-wrap gap-x-2">
                        {g.items.map((x, i) => (
                          <span key={x.n}>
                            <A href={x.h}>{x.n}</A>
                            {i < g.items.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-lg border border-hairline bg-nested p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                  Bridges
                </h3>
                <ul className="mt-3 space-y-2 text-ink-2">
                  <li>
                    <A href="https://bridge.lucidlabs.fi/">Lucid Labs Bridge</A>
                  </li>
                  <li>
                    <A href="https://www.reddex.io/bridge">Reddex Bridge</A>
                  </li>
                </ul>
                <p className="mt-3 text-ink-2">
                  Native RBNT and wrapped RBNT are separate assets on different chains. Check which
                  one a venue lists before trading.
                </p>
              </div>
            </div>
            <Note>
              Source: exchange and DEX listings and contract addresses cross-checked against the
              venues' own pages.
            </Note>
          </Card>

          {/* 6. Staking */}
          <Card id="staking" step="06" title="Staking basics">
            <p className="max-w-[70ch] text-ink-2">
              RBNT can be staked to consensus or storage nodes to help secure the network and earn
              rewards. Staking is a mainnet action and requires KYC, the same as any other native
              transaction.
            </p>
            <p className="mt-4 max-w-[70ch] text-ink-2">
              Available pools differ by lock period and reward rate. Some carry no lock period;
              others lock funds for a fixed term for a higher rate. Rates and total value locked
              change over time, so check the staking page directly for current numbers rather than
              relying on a snapshot here.
            </p>
            <a
              href="https://www.reddex.io/stake"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Stake on Reddex
            </a>
            <Note>
              Source: staking mechanism confirmed against the Redbelly whitepaper (consensus and
              storage node staking). Live pool terms from{" "}
              <A href="https://www.reddex.io/stake">reddex.io/stake</A>.
            </Note>
          </Card>

          {/* 7. Faucet */}
          <Card id="faucet" step="07" title="Testnet faucet" kicker="Chain ID 153">
            <p className="max-w-[70ch] text-ink-2">
              Get free testnet RBNT to deploy and test on Redbelly Testnet, Chain ID 153.
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                {
                  k: "Faucet",
                  v: (
                    <Mono>
                      <A href="https://vine.redbelly.network/rbnt-faucet">
                        vine.redbelly.network/rbnt-faucet
                      </A>
                    </Mono>
                  ),
                  s: "FAUCETME-powered.",
                },
                { k: "Claim amount", v: "500 RBNT per claim" },
                { k: "Network", v: <>Testnet, Chain ID <Mono>153</Mono></> },
                { k: "Typical deployment cost", v: "Effectively zero gas on testnet" },
              ].map((r) => (
                <div key={r.k} className="rounded-lg border border-hairline bg-nested p-4">
                  <dt className="text-sm text-ink-muted">{r.k}</dt>
                  <dd className="mt-1 break-all">{r.v}</dd>
                  {r.s ? <p className="mt-1 text-sm text-ink-muted">{r.s}</p> : null}
                </div>
              ))}
            </dl>
            <Note>
              Source:{" "}
              <A href="https://vine.redbelly.network/rbnt-faucet">
                vine.redbelly.network/rbnt-faucet
              </A>
              , confirmed live.
            </Note>
          </Card>

          {/* Cross-links */}
          <section
            id="cross-links"
            className="rounded-lg border border-border bg-card"
            aria-labelledby="cross-links-title"
          >
            <header className="px-5 py-4 sm:px-6">
              <h2 id="cross-links-title" className="text-lg font-semibold">
                Cross-links
              </h2>
            </header>
            <div className="border-t border-border px-5 py-5 sm:px-6">
              <ul className="grid gap-2 text-ink-2 sm:grid-cols-2">
                <li>
                  <A href="https://docs.redbelly.network">Redbelly docs</A>
                </li>
                <li>
                  <A href="https://redbelly.network/terms-and-conditions">Terms and conditions</A>
                </li>
                <li>
                  <A href="https://redbelly.routescan.io">Mainnet explorer</A>
                </li>
                <li>
                  <A href="https://redbelly.testnet.routescan.io">Testnet explorer</A>
                </li>
                <li>
                  <A href="https://chainlist.org/chain/151">Chainlist, mainnet 151</A>
                </li>
                <li>
                  <A href="https://redbelly-dao-taskboard.vercel.app/brand">
                    Kinetic Consensus brand kit
                  </A>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-4 py-8 sm:px-16">
          <a href={TASKBOARD} aria-label="Redbelly DAO task board">
            <img src={logoDark} alt="Redbelly DAO" className="h-8 w-auto" />
          </a>
          <p className="text-center text-sm text-ink-muted">
            Redbelly DAO community task board. Content draft TASK-17.
          </p>
          <div className="flex items-center gap-4 text-ink-muted">
            <a
              href="https://github.com/poundeater/task17hub"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="block transition-colors hover:text-accent-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.79 0C18.16 4.95 19.13 5.26 19.13 5.26c.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
              </svg>
            </a>
            <a
              href="https://dev.to/poundeater/building-the-redbelly-dao-start-here-onboarding-hub-2nb5"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="dev.to"
              className="block transition-colors hover:text-accent-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M2.5 3.5h19A2.5 2.5 0 0 1 24 6v12a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 18V6a2.5 2.5 0 0 1 2.5-2.5Zm2.7 5.06v6.9h1.9c1.42 0 2.3-.86 2.3-2.3v-2.3c0-1.44-.88-2.3-2.3-2.3H5.2Zm1.55 1.5h.35c.5 0 .75.28.75.8v2.3c0 .52-.25.8-.75.8h-.35v-3.9Zm4.2-1.5 1.6 6.9h1.6l1.6-6.9h-1.6l-.8 4.3-.8-4.3h-1.6Zm6.2 0v6.9h3.6v-1.5h-2.05v-1.2h1.8v-1.5h-1.8v-1.2h2.05V8.56h-3.6Z" />
              </svg>
            </a>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View full PDF"
              className="block transition-colors hover:text-accent-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8.5 13h7" />
                <path d="M8.5 16.5h7" />
              </svg>
            </a>
            <a
              href={DOCX_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View full DOCX"
              className="block transition-colors hover:text-accent-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8.5 14l1.2 4 1.3-3 1.3 3 1.2-4" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
