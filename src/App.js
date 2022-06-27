import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { BANK_ABI, MAIN_ABI, MAIN_ADDRESS } from './Constance/config';
import moment from "moment"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const Web3 = require('web3');

function App() {
  const [account, setAccount] = useState();
  const [contactList, setContactList] = useState();
  const [contacts, setContacts] = useState([]);
  const [withdrawValue, setwithdrawValue] = useState(0)
  const [depositValue, setdepositValue] = useState(0)
  const [balance, setbalance] = useState(0)
  const [supply, setsupply] = useState(0)
  const [tableList, settableLst] = useState([])


  const [open, setOpen] = useState(false);
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    }

    load();
    gethis()
    getS()

  }, []);
  useEffect(() => {
    if (account) {
      getB()
    }


  }, [account]);

  window.ethereum.on('accountsChanged', function (accounts) {
    console.log(account)
    window.location.reload(false);
    gethis()
    getS()
    // Time to reload your interface with accounts[0]!
  })



  useEffect(() => {
    account && console.log("account", account)

  }, [account])


  const getContract = () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const contract = new web3.eth.Contract(MAIN_ABI, MAIN_ADDRESS)
    return contract
  }

  const gethis = async () => {
    handleToggle()
    const contractInstance = getContract()
    const { methods } = contractInstance
    const { gethistory } = methods
    await gethistory().call().then((res) => {
      console.log("history", res)
      let newArr = []
      let row = {}
      res.map((item, index) => {
        newArr.push({ account: item.owner, type: item.paytype, amount: item.amount, date: moment.unix(parseInt(item.timeStamp)).format("DD/MM/YYYY") })
      })
      newArr.push(row)
      settableLst(newArr)
      handleClose()
    })
  }


  const aaa = () => {
    const a = [1, 2, 3]
    // for (item in a) {
    //   console.log(item)
    // }
    // a.map((item) => {
    //   console.log(item)
    // })
    // a.forEach((item) => {
    //   console.log(item)
    // })
  }

  const dep = async () => {
    handleToggle()
    const contractInstance = getContract()
    const { methods } = contractInstance
    const { deposit, gethistory } = methods
    const value = parseInt(depositValue)
    await deposit(value).send({ from: account }).then((res) => {
      console.log(res);
      getB()
      gethis()
      getS()
      setdepositValue(0)
      handleClose()
    })
  }
  const draw = async () => {
    handleToggle()
    const contractInstance = getContract()
    const { methods } = contractInstance
    const { withdraw, gethistory } = methods
    const value = parseInt(withdrawValue)
    await withdraw(value).send({ from: account }).then((res) => {
      console.log(res);
      getB()
      gethis()
      getS()
      setwithdrawValue(0)
      handleClose()
    })
  }
  async function getB() {
    handleToggle()
    const contract = getContract();
    await contract.methods.getBalance().call({ from: account }).then((res) => {
      setbalance(res)
      console.log(res)
      handleClose()
    })
  }

  async function getS() {
    handleToggle()
    const contract = getContract();
    await contract.methods.getTotalSupply().call().then((res) => {
      setsupply(res)
      console.log(res)
      handleClose()
    })
  }

  return (
    <div className='Main-Container'>

      <Typography variant="h2" gutterBottom component="div">LEARNING SMART CONTRACT</Typography>

      <Typography variant="h6" gutterBottom component="div">Your account is: {account}</Typography>
      <Typography variant="h6" gutterBottom component="div">Your Balance is: {balance}</Typography>
      <Box
        sx={{
          width: 300,
          p: 2
        }}
      >
        <Stack spacing={2}>
          <input value={withdrawValue} onChange={(e) => {
            setwithdrawValue(e.target.value)
          }} type={"number"}></input>
          <Button variant="contained" color="error" onClick={() => {
            draw()
          }}>Withdraw</Button>
          <input value={depositValue} onChange={(e) => {
            setdepositValue(e.target.value)
          }} type={"number"}></input>
          <Button variant="contained" color="success" onClick={() => {
            dep()
          }}>Deposit</Button>
        </Stack>
      </Box>
      <Box
        sx={{
          p: 2
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Payment Type </TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">From</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableList?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" >
                    {item.type}
                  </TableCell>
                  <TableCell align="center">{item.amount}</TableCell>
                  <TableCell align="right">{item.date}</TableCell>
                  <TableCell align="right">{item.account}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Typography variant="h2" gutterBottom component="div">Total Supply is: {supply}</Typography>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>
  );
}

export default App;
