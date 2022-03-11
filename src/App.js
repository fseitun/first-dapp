import { useState } from 'react';
import { ethers } from 'ethers';
import abiJson from './abiJson.json';
import { abiJs } from './abiJs';
// console.log(abiJs);
// console.log(abiJson);

/*const hardcodedAbi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string"
      }
    ],
    name: "setter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];*/

const { ethereum } = window;

const contractAddress = '0xcD3F50920F23C5433cBC5F3d1F5b6cCa1CCF672E';

export function App() {
  const [chain, setChain] = useState('');
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState({});
  const [signer, setSigner] = useState({});

  // const contract = new ethers.Contract(contractAddress, hardcodedAbi, signer);

  return (
    <>
      <button onClick={() => getChain(setChain)}>get Chain</button>
      <button onClick={() => getAccount(setAccount)}>get account</button>
      <button onClick={() => getProvider(setProvider)}>get provider</button>
      <button onClick={() => getSigner(provider, setSigner)}>get Signer</button>
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
    const account = accounts[0];
  } catch {
    account = "user didn't connect";
  }
  console.log('account', account);
  setAccount(account);
}

async function getProvider(setProvider) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log('provider', provider);
  setProvider(provider);
}

async function getSigner(provider, setSigner) {
  let signer;
  try {
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
  } catch {
    signer = "user didn't connect";
  }
  console.log('signer', signer);
  setSigner(signer);
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
