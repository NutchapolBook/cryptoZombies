import Web3 from 'web3';

const web3 = new Web3('http://localhost:8545');
var cryptoZombies;
var userAccount;

function startApp() {
  var cryptoZombiesAddress = "YOUR_CONTRACT_ADDRESS"
  cryptoZombies = new web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);

  var accountInterval = setInterval(function () {
    // ดูว่าได้เปลี่ยนบัญชีรึเปล่า
    if (web3.eth.accounts[0] !== userAccount) {
      userAccount = web3.eth.accounts[0];
      // เรียกฟังก์ชั่นบางตัวออกมาเพื่ออัพเดทส่วนของ UI ตามบัญชีที่เปลี่ยนไป
      getZombiesByOwner(userAccount).then(displayZombies);
    }
  }, 100);

  // ใช้ `filter` เพื่อให้เรียกโค้ดส่วนนี้ออกมาเมื่อใดก็ตามที่ส่วน `_to` นั้นมีค่าเท่ากับ `userAccount`
  cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
    .on("data", function (event) {
      let data = event.returnValues;
      getZombiesByOwner(userAccount).then(displayZombies);
      // ผู้ใช้คนปัจจุบันเพิ่งได้รับซอมบี้!
      // อัพเดท UI เพื่อให้มันมีการแจ้งเตือนว่าเกิดข้อผิดพลาด
    }).on("error", console.error);
}

function displayZombies(ids) {
  $("#zombies").empty();
  // ดูข้อมูลซอมบี้ที่ได้จาก contract และ return อ็อบเจ็กต์ `zombie` ออกมา
  for (id of ids) {
    getZombieDetails(id)
      .then(function (zombie) {
        // ใช้ "template literals" ของ ES6 ในการเพิ่มตัวแปรเข้าไปยังไฟล์ HTML
        // Append ตัวแปรแต่ละตัวเข้าไปยัง #zombies div
        $("#zombies").append(`<div class="zombie">
          <ul>
            <li>Name: ${zombie.name}</li>
            <li>DNA: ${zombie.dna}</li>
            <li>Level: ${zombie.level}</li>
            <li>Wins: ${zombie.winCount}</li>
            <li>Losses: ${zombie.lossCount}</li>
            <li>Ready Time: ${zombie.readyTime}</li>
          </ul>
        </div>`);
      });
  }
}

function createRandomZombie(name) {
  // โดยตรงนี้อาจจะต้องใช้เวลาเล็กน้อย ดังนั้นเราจึงต้องอัพเดทให้ UI มีการบอกผู้ใช้ด้วยว่า
  // transaction ได้ถูกส่งไปแล้วเรียบร้อย
  $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
  // ส่ง tx ไปยัง contract ของเรา:
  return CryptoZombies.methods.createRandomZombie(name)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
      $("#txStatus").text("Successfully created " + name + "!");
      // Blockchain ยอมรับ transaction ให้เข้ามาแล้ว ได้เวลาของการขียน UI ขึ้นมาใหม่
      getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {
      // ให้เตือนผู้ใช้ว่า transaction ของพวกเขาเกิดความล้มเหลว
      $("#txStatus").text(error);
    });
}

function feedOnKitty(zombieId, kittyId) {
  // โดยตรงนี้อาจจะต้องใช้เวลาเล็กน้อย ดังนั้นเราจึงต้องอัพเดทให้ UI มีการบอกผู้ใช้ด้วยว่า
  // transaction ได้ถูกส่งไปแล้วเรียบร้อย
  $("#txStatus").text("Eating a kitty. This may take a while...");
  // ส่ง tx ไปยัง contract ของเรา:
  return CryptoZombies.methods.feedOnKitty(zombieId, kittyId)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
      $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
      // Blockchain ยอมรับ transaction ให้เข้ามาแล้ว ได้เวลาของการขียน UI ขึ้นมาใหม่
      getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {
      // ให้เตือนผู้ใช้ว่า transaction ของพวกเขาเกิดความล้มเหลว
      $("#txStatus").text(error);
    });
}

function levelUp(zombieId) {
  $("#txStatus").text("Leveling up your zombie...");
  return CryptoZombies.methods.levelUp(zombieId)
    .send({ from: userAccount, value: web3js.utils.toWei("0.001") })
    .on("receipt", function (receipt) {
      $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");
    })
    .on("error", function (error) {
      // ให้เตือนผู้ใช้ว่า transaction ของพวกเขาเกิดความล้มเหลว
      $("#txStatus").text(error);
    });
}

function getZombieDetails(id) {
  return cryptoZombies.methods.zombies(id).call();
}

function zombieToOwner(id) {
  return cryptoZombies.methods.zombieToOwner(id).call()
}

function getZombiesByOwner(owner) {
  return cryptoZombies.methods.getZombiesByOwner(owner).call()
}

window.addEventListener('load', function () {
  // เช็คว่าได้เพิ่ม Web3 ไปยัง browser แล้วหรือยัง (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // ใช้ provider ของ Mist/MetaMask
    web3js = new Web3(web3.currentProvider);
  } else {
    // จัดการกับกรณีที่ผู้ใช้ยังไม่มี web3. โดยที่สามารถ
    // แสดง message ที่จะเตือนให้ลง MetaMask
    // ถ้าหากจะใช้ application ของเรา
  }

  // ในตอนนี้ก็จะสามารถเริ่มการใช้งานแอพฯ ของเราได้แล้ว และยังสามารถเข้าถึง web3js ได้อย่างอิสระอีกด้วย:
  startApp()
})