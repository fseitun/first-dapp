import { useState } from 'react';
import { ethers } from 'ethers';
import abiJson from './abiJson.json';

const { ethereum } = window;

const contractAddress = '0xcD3F50920F23C5433cBC5F3d1F5b6cCa1CCF672E';

export function App() {
  const [chain, setChain] = useState('');
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState({});
  const [signer, setSigner] = useState({});
  const [contract, setContract] = useState({});

  return (
    <>
      <button onClick={() => getChain(setChain)}>get Chain</button>
      <button onClick={() => getAccount(setAccount)}>get account</button>
      <button onClick={() => getProvider(setProvider)}>get provider</button>
      <button onClick={() => getSigner(provider, setSigner)}>get Signer</button>
      <button onClick={() => getContract(signer, setContract)}>get Contract</button>
      <div>{chain ? `chain: ${chain}` : 'fetch chain'}</div>
      <br />
      <div>{account ? `account: ${account}` : 'fetch account'}</div>
      <br />
      {Object.keys(provider).length ? <ObjectToDiv obj={provider} /> : <div>fetch provider</div>}
      <br />
      {typeof signer === 'string' ? (
        <div>{signer}</div>
      ) : Object.keys(signer).length ? (
        <ObjectToDiv obj={signer} />
      ) : (
        <div>fetch signer</div>
      )}
      <br />
      {Object.keys(signer).length ? <ObjectToDiv obj={contract} /> : <div>fetch contract</div>}
    </>
  );
}

async function getChain(setChain) {
  const chain = await ethereum.request({ method: 'eth_chainId' });
  setChain(chain);
}

async function getAccount(setAccount) {
  let account;
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    account = accounts[0];
  } catch {
    account = 'waiting for user to connect';
  }
  console.log('account', account);
  setAccount(account);
}

async function getProvider(setProvider) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log('provider state:', provider);
  setProvider(provider);
}

async function getSigner(provider, setSigner) {
  let signer;
  try {
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
  } catch {
    signer = 'waiting for user to connect';
  }
  console.log('signer state:', signer);
  setSigner(signer);
}

async function getContract(signer, setContract) {
  let contract;
  try {
    contract = new ethers.Contract(contractAddress, abiJson, signer);
  } catch {
    contract = 'waiting for user to connect';
  }
  console.log('contract state:', contract);
  setContract(contract);
}

function ObjectToDiv({ obj }) {
  return (
    <div>
      {Object.keys(obj).map(
        key =>
          typeof obj[key] !== 'object' && (
            <div key={key}>
              <span>{key}: </span>
              <span>{obj[key]}</span>
            </div>
          )
      )}
    </div>
  );
}
