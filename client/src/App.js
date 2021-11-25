import React, {useState, useRef, useEffect, Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import {Container, Card, CardContent, makeStyles, Grid, TextField, Button} from '@material-ui/core';
import QRCode from 'qrcode';
import QrReader from 'react-qr-reader';
import useGeolocation from 'react-hook-geolocation'
import Geocode from "react-geocode";
import "./App.css";
import dotenv from 'dotenv'

dotenv.config({path: '../../.env'})

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


    const geolocation= useGeolocation()



  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    }catch (error) {
      console.log(error);
    }
  }
  const handleErrorWebCam = (error) => {
    console.log(error);
    alert("Something went wrong when scanning the QR code")
  }
  const handleScanWebCam =async (result) => {
    if (result){

      if(!geolocation.error) {
        const a = geolocation.latitude + ","+ geolocation.longitude +","+ result
        console.log('result webcam', a)
        setNewValue(a)

        await contract.methods.set(a).send({from: accounts[0]});
        const response = await contract.methods.get().call();
        console.log('response new', response)
        setStorageValue(response);
        setScanResultWebCam(result);


      }else{
        console.log('Geo error')
        alert("We are unable to get your current location")
      }
    }
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

  return (
      <>
        {!web3 ?  <div>Loading Web3, accounts, and contract...</div> :

      <Container className={classes.conatiner}>
        Last known location from the blockchain {storageValue} <br/>


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

              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <h3>QR Code Scan by Web Cam {scanResultWebCam}</h3>
                <QrReader
                    delay={2000}
                    style={{width: '100%'}}
                    onError={handleErrorWebCam}
                    onScan={handleScanWebCam}
                />


              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
        }
      </>
  );
};



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
