var colors = require('colors');
var dateFormat = require('dateformat');
var mysql = require('mysql');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

var accountNumber='0x6886ab0B9F907D0104703935c864D6c77cEDAb8B';

function log(text){
	var now=new Date();
	console.log(("["+dateFormat(now, 'yyyy-mm-dd HH:MM:ss')+"]").green+" "+text);
}

function sleep(ms) {
  var start = new Date().getTime(), expire = start + ms;
  while (new Date().getTime() < expire) { }
  return;
}

function createTransaction(){
var trx=web3.eth.sendTransaction({
		from: accountNumber, 
		to: "0x6f6deb5db0c4994a8283a01d6cfeeb27fc3bbe9c", 
		value: "200000000000000", 
		gas: "200200", 
		gasPrice: "10000000000", 
		data: "0x266995760000000000000000000000000000000000000000000000000000000000d70c88000000000000000000000000dfffe934c59da76f4f4245937704c015bc364866"});
	return trx;
}

var con = mysql.createConnection({
  host: "192.168.1.168",
  user: "smartbillions",
  password: "so11fe"
});

con.connect();

  var sql = "INSERT INTO trx_out (trxid, creationdate) VALUES ('a',sysdate())";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Rekord wstawiony do bazy danych.");
  });

web3.personal.unlockAccount(accountNumber,"");
log('hello'.green);
var bal=web3._extend.utils.fromWei(web3.eth.getBalance(accountNumber),'ether');
log(("Stan konta "+bal).red);
var trx=createTransaction();
log(("Zlozono transakcje "+trx).blue);

con.connect(function(err) {
  if (err){
	console.log(err);
	  throw err;
  }
  var sql = "INSERT INTO trx_out (trxid, creationdate) VALUES ("+trx+",sysdate())";
	 con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Rekord wstawiony do bazy danych.");
  });
});



do{
	log(("Oczekiwanie na wykopanie transakcji "+trx).blue);
	var trxData=web3.eth.getTransaction(trx);
	if(!trxData)
		continue;
	blockNr=trxData.blockNumber;
	sleep(15000);
}while(blockNr==null);

