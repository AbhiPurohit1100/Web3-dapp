import { createWalletClient, custom, createPublicClient, parseEther, defineChain} from 'https://esm.sh/viem'

import { contractAddress, abi1 } from './constants-js.js'
const connectbutton =  document.getElementById("connectbutton")

let WalletClient
let publicClient

//connection 

connectbutton.onclick = async () =>{
    if(typeof window.ethereum!=="undefined"){
        console.log('have metamask')
        WalletClient = createWalletClient({
            transport: custom(window.ethereum)

        })
        await WalletClient.requestAddresses()
        console.log("connected successfully")
        connectbutton.innerHTML = "connection done"
    }   
    else{
        connectbutton.innerHTML = "Download metamask"
    }
}

//connection done

//buy coffee

const amount = document.getElementById("ethAmount")
const buycoffee = document.getElementById("buycoffee")

buycoffee.onclick = fund

async function fund() {
    const totalamount = amount.value
    console.log(`funding amount ${totalamount}....`)
    if(typeof window.ethereum!=="undefined"){
        console.log('have metamask wgile funding')
        WalletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        const [connectedAccount] =  await WalletClient.requestAddresses()
        const chain = await getCurrentChain(WalletClient)
        await WalletClient.requestAddresses()
        console.log("connected successfully wallet")
        connectbutton.innerHTML = "connection done"
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        // Use writeContract instead of simulateContract + sendTransaction
        const txHash = await WalletClient.writeContract({
            address: contractAddress,
            abi: abi1,
            functionName: "fund",
            account: connectedAccount,
            chain: chain,
            value: parseEther(totalamount),
        })
        console.log("Transaction hash:", txHash)
    }
    else{
        connectbutton.innerHTML = "Download metamask"
    }
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  })
  return currentChain
}
