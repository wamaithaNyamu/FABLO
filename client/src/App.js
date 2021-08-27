import React, {useState, useRef, useEffect, Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import {Container, Card, CardContent, makeStyles, Grid, TextField, Button} from '@material-ui/core';
import QRCode from 'qrcode';
import QrReader from 'react-qr-reader';
import "./App.css";

const QR =()=>{
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  const [scanResultWebCam, setScanResultWebCam] =  useState('');
  const [account, setAccount] = useState('')
  const classes = useStyles();
  const qrRef = useRef(null);
  const [storageValue,setStorageValue] = useState("")
  const [newValue,setNewValue] = useState("")
  const [web3,setWeb3] = useState(null)
  const [accounts,setAccounts] = useState(null)
  const [contract,setContract] = useState(null)



  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    }catch (error) {
      console.log(error);
    }
  }
  const handleErrorFile = (error) => {
    console.log(error);
  }
  const handleScanFile = (result) => {
    if (result) {
      setScanResultFile(result);
    }
  }
  const onScanFile = () => {
    qrRef.current.openImageDialog();
  }
  const handleErrorWebCam = (error) => {
    console.log(error);
  }
  const handleScanWebCam =async (result) => {
    if (result){
      console.log('result webcam',result,typeof (result))
      setNewValue(result)
      await contract.methods.set(result).send({ from: accounts[0] });
      const response = await contract.methods.get().call();
      console.log('response new',response)
      setStorageValue(response)

      setScanResultWebCam(result);
    }
  }
  const handleOnchange= (e) => {
    setNewValue(e.target.value)

  }
  const handleSubmit = async(e)=>{
    e.preventDefault()

    await contract.methods.set(newValue).send({ from: accounts[0] });
    const response = await contract.methods.get().call();
    console.log('response',response)
    setStorageValue(response)
  }
  const runExample = async () =>{
    try{
      // await loadBlockchainData()
      const web3 = await getWeb3();
      setWeb3(web3)
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
      );
      setContract(instance)
      const response = await instance.methods.get().call();
      console.log('response',response)
      // Update state with the result.
      setStorageValue(response)
    }catch (e){
      console.log('error from use effect',e)
    }
  }
  runExample()
  //
  // useEffect(async ()=>{
  //
  // },[storageValue])
  return (
      <>
        {!web3 ?  <div>Loading Web3, accounts, and contract...</div> :

      <Container className={classes.conatiner}>
       current {storageValue}
        <Card>

          <h2 className={classes.title}>FABLO QR</h2>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <TextField label="Enter farmer ID" onChange={(e) => setText(e.target.value)}/>
                <Button className={classes.btn} variant="contained"
                        color="primary" onClick={() => generateQrCode()}>Generate QR </Button>
                <br/>
                <br/>
                <br/>
                {imageUrl ? (
                    <a href={imageUrl} download>
                      <img src={imageUrl} alt="img"/>
                    </a>) : null}
              </Grid>
              {/*<Grid item xl={4} lg={4} md={6} sm={12} xs={12}>*/}
              {/*  <Button className={classes.btn} variant="contained" color="secondary" onClick={onScanFile}>Scan Qr Code</Button>*/}
              {/*  <QrReader*/}
              {/*    ref={qrRef}*/}
              {/*    delay={300}*/}
              {/*    style={{width: '100%'}}*/}
              {/*    onError={handleErrorFile}*/}
              {/*    onScan={handleScanFile}*/}
              {/*    legacyMode*/}
              {/*  />*/}
              {/*  <h3>Scanned Code: {scanResultFile}</h3>*/}
              {/*</Grid>*/}
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <h3>QR Code Scan by Web Cam {scanResultWebCam}</h3>
                <QrReader
                    delay={300}
                    style={{width: '100%'}}
                    onError={handleErrorWebCam}
                    onScan={handleScanWebCam}
                />
                {/*<h3>Scanned By WebCam Code: {scanResultWebCam}</h3>*/}

              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
        }
      </>
  );
};



// class App extends Component {
//   state = { storageValue: "",newValue:"", web3: null, accounts: null, contract: null };
//
//   componentDidMount = async () => {
//     try {
//
//       this.handleOnchange = this.handleOnchange.bind(this);
//       this.handleSubmit = this.handleSubmit.bind(this);
//       // Get network provider and web3 instance.
//       const web3 = await getWeb3();
//
//       // Use web3 to get the user's accounts.
//       const accounts = await web3.eth.getAccounts();
//
//       // Get the contract instance.
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = SimpleStorageContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         SimpleStorageContract.abi,
//         deployedNetwork && deployedNetwork.address,
//       );
//
//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
//       this.setState({ web3, accounts, contract: instance }, this.runExample);
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };
//
//   handleOnchange(e){
//     this.setState({newValue:e.target.value})
//
//   }
//   async handleSubmit(e){
//     e.preventDefault()
//     const { accounts, contract } = this.state;
//     await contract.methods.set(this.state.newValue).send({ from: accounts[0] });
//     const response = await contract.methods.get().call();
//     console.log('response',response)
//     this.setState({storageValue:response})
//   }
//
//   runExample = async () => {
//     const {  contract } = this.state;
//
//     // Stores a given value, 5 by default.
//     // await contract.methods.set("").send({ from: accounts[0] });
//
//     // Get the value from the contract to prove it worked.
//     const response = await contract.methods.get().call();
//     console.log('response',response)
//     // Update state with the result.
//     this.setState({ storageValue: response });
//   };
//
//   render() {
//     if (!this.state.web3) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//         <h1>FABLO GOOD STUFF!</h1>
//
//         <div>The stored value is: {this.state.storageValue}</div>
//       <form onSubmit={this.handleSubmit}>
//         <input type="text" value={this.state.newvalue} onChange={this.handleOnchange}/>
//       <input type="submit" value="Submit"/>
//       </form>
//
//       </div>
//     );
//   }
// }

const useStyles = makeStyles((theme) => ({
  conatiner: {
    marginTop: 10
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems:  'center',
    background: '#3f51b5',
    color: '#fff',
    padding: 20
  },
  btn : {
    marginTop: 10,
    marginBottom: 20
  }
}));

export default QR;
