(function(){
      
  //=========== URLs Start  ========= //
  
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=100&page=1&sparkline=false';
  const url1 = 'https://api.coingecko.com/api/v3/global';
  //=========== URLs End  ========= //
  
  
  
  //=========== Constants and Variables Start  ========= //
  
  const searchInput = document.querySelector('.center-header .searchAsset');
  const clearInputBtn = document.querySelector('.center-header .clearInputValue');
  const coinList = document.querySelector('.center-header .searchResults .coinList');
  const notiIcon = document.getElementsByClassName('notifications')[0];
  const setiIcon = document.getElementsByClassName('settings-btn')[0];
  const searchBtn =  document.querySelector('.button-group .search');
  const centerHeader = document.querySelector('.center-header');
  const backButton = document.querySelector('.back-button');
  const leftHeader = document.querySelector('.left-header');
  const rightHeader = document.querySelector('.right-header');
  const notificationBtn = document.querySelector('#dropdown .notificationEnabler');
  const dropDown = document.getElementById('dropdown');
  
  var allAssets = [];
  var removeId = 0;
  var assetsWatchList = [];
  var num1 = 0;
  
  //=========== Constants and Variables End ========= //
  
  
  //================ Adding Event handler Start ==================//
  
  function addEvent() {     
        notiIcon.addEventListener('click', displayAlertModal);
        setiIcon.addEventListener('click', showNotificationEnabler);
        searchBtn.addEventListener('click', showSearchAssetBar);
        backButton.addEventListener('click', returnBack);
        searchInput.addEventListener('keyup', showMatchingCoinList);
        searchInput.addEventListener('focus', addStyleCenterHeader);
        searchInput.addEventListener('blur', removeStyleCenterHeader);
        document.querySelector('.priceAlertModal .closeBox').addEventListener('click', function(){closeBox('.priceAlertModal')});
        document.querySelector('.priceAlertModal .emptyBox').addEventListener('click', emptyAlertModalBox);
        document.querySelector('#dropdown .notificationEnabler').addEventListener('click', askNotificationPermission)
        window.addEventListener('resize', hideandShowElements);      
  }
  
  //================ Adding Event handler End ==================//
  function hideandShowElements(){
        if(window.innerWidth <= 768) {         
           if (searchBtn.value) {
              centerHeader.style.display = "block";
              backButton.style.display = "block";
              leftHeader.style.display = "none";
              rightHeader.style.display = "none";
              searchBtn.style.display = "none";
              document.querySelector('.brand').style.justifyContent = "space-around";
           } else {
              centerHeader.style.display = "none";
              leftHeader.style.display = "block";
              searchBtn.style.display = "block";
              rightHeader.style.display = "flex";
            }          
        }
        else {
              backButton.style.display = "none";
              leftHeader.style.display = "block";
              centerHeader.style.display = "block";
              rightHeader.style.display = "flex";
              searchBtn.style.display = "none";
              document.querySelector('.brand').style.justifyContent = "";
        }
  }
  
  function showSearchAssetBar() {
        this.value = true;
        centerHeader.style.display = "block";
        leftHeader.style.display = "none";
        rightHeader.style.display = "none";
        backButton.style.display = "block";
        searchBtn.style.display = "none"
        document.querySelector('.brand').style.justifyContent = "space-around";
  }
  
  function returnBack(){
        this.style.display = "none";
        leftHeader.style.display = "block";
        rightHeader.style.display = "flex";      
        searchBtn.style.display = "block";
        searchBtn.value = false;  
        centerHeader.style.display = "none";
        document.querySelector('.brand').style.justifyContent = "";  
  }
  
  function displayAlertModal(){
        num1 = 0;
        document.querySelector('.priceAlertModal').style.display = "block";
        document.querySelector('.notification-btn .totalNotifications').style.display="none";
  }
  
  function showNotificationEnabler(){ 
        let text = (dropDown.style.display === 'flex')? '':'flex';
        dropDown.style.display = text;
  }
  
  function showMatchingCoinList() {
      if(this.value.length != 0) {
         clearInputBtn.style.display = "inline-block";
         clearInputBtn.addEventListener('click', clearInputField);
      } else {
         clearInputBtn.style.display = "none";
         clearInputBtn.removeEventListener('click', clearInputField);
      }     
      if(this.value.length >= 3) {
        coinList.innerHTML = "";      
        for (let i = 0; i < allAssets.length; i++){       
                var filter = this.value.toUpperCase();              
                var coin = allAssets[i].name;
                var sym = allAssets[i].symbol;
                var img = allAssets[i].image;
                var id = allAssets[i].id;                                                                 
                if(coin.toUpperCase().indexOf(filter) > -1) {                  
                     coinList.insertAdjacentHTML("beforeend",`<li><p class="coin-detail"><img src=${img} class="icons"> <span class="coin-name">${coin}</span> <span class="coin-symbol">${sym}</span></p><p><button class="addAssetToWatchlist" value=${id}>Add+</button></p></li>`)                  
                }   
        }     
        if(coinList.innerHTML == "") {
          coinList.innerHTML = `<li><p class="coin-detail"><img src="images/sorry.png" class="icons"><span class="coin-name">Sorry!! No results found</span> </p></li>`;
        } else {
              document.querySelectorAll('.addAssetToWatchlist').forEach(element => {
                    element.addEventListener('click',addAssetToWatchlist);
              })
        }
         } else {
              document.querySelectorAll('.addAssetToWatchlist').forEach(element => {
                    element.removeEventListener('click',addAssetToWatchlist);
              })
              coinList.innerHTML = "";
              }
  }
  
  function addAssetToWatchlist(){       
          showCreateAlertForm(this.value);  
  }
  
  function removeAssetsFromWatchlist(){
      let ID = this.id;
      assetsWatchList.forEach((element, index) =>{
            if(ID == element.coinRemoveId) {
               assetsWatchList.splice(index,1);
            }
      })
      if(assetsWatchList.length === 0) {
        document.getElementsByClassName('assets-table')[0].style.display = 'none';
        document.getElementsByClassName(`empty-table`)[0].style.display = 'block';
      }  
      this.parentNode.parentNode.style.display = 'none';
  }
  
  function signAndColorDefinition(priceChange){
        let change, changeClass;
        if (Math.sign(priceChange) === 1) {
              change = '+' + priceChange.toFixed(2);
              changeClass = 'change gain';
             } else {
              change = priceChange.toFixed(2);
              changeClass = 'change loss';
             } 
             return [change, changeClass]
  }
  
  function showCreateAlertForm(num){
        coinList.innerHTML = '';     
        allAssets.forEach(element => {
              if(element.id === num){
                    let changes = signAndColorDefinition(element.price_change_percentage_24h);   
                    let text = `
                          <span class="closeBox">&times;</span>
                          <div class="formBox">          
                                      <div class="top-container">
                                            <div class="coin-name"><img src=${element.image} class="icons"/>${element.name}</div>                               
                                            <div class="coin-price">£${element.current_price} <span class='${changes[1]}'>${changes[0]}%</span></div>
                                      </div>
                                      <hr>                         
                                      <div class="action-container">
                                            <div class="alert price">                                        
                                                  <h3>Price Alert</h3>                                                                                                                     
                                                  <div class="value-input">
                                                        <label for="direction">When it's</label>
                                                        <select name="direction" id="direction">
                                                              <option value="above">&#8593; above</option>
                                                              <option value="below">&darr; below</option>
                                                        </select>
                                                        <label for="price-alert"> the target price of </label>
                                                        <div class="inputDiv">
                                                              <span class="poundSign">£</span>
                                                              <input type="number" id="target-price" placeholder="Enter target price..."/>
                                                        </div>
                                                        <button class="createAlert" value=${num}>Create Alert</button>
                                                  </div>                                        
                                            </div>
                                      </div>
                          </div>
                                `
                    document.querySelector('.modalBox').innerHTML = text;
                    document.querySelector('.modalBox').style.display = "block";
                    document.querySelector('.modalBox .closeBox').addEventListener('click' , function(){closeBox('.modalBox')});
                    document.querySelector('.createAlert').addEventListener('click', createAlert) 
              }
        
        })
        
       
   
    }
  
  function createAlert(){
       if (assetsWatchList.length !== 0) removeId++;   
       let targetPrice = document.querySelector('#target-price').value;
       let movement = document.querySelector('#direction').value;
       let assetImage, assetName, assetSymbol;
       if(!targetPrice) return
       let coinAlert = {
             status: 'On',
             target: targetPrice,
             movement: movement
       }
       let upDown = movement === 'above'? '>': '<';
       let txt = `<div class='status'>
                               <div class="state lightBlue">On <span class="target-price">(${upDown} £ ${targetPrice})</span></div> 
                               <div class="target-price"> 
                               </div>
                  </div>`;
       let ID = this.value;
       document.getElementsByClassName('empty-table')[0].style.display = '';
       document.getElementsByClassName('assets-table')[0].style.display = '';
       allAssets.forEach(element => {
              if(ID === element.id) {
                    assetImage = element.image;
                    assetName = element.name;
                    assetSymbol = element.symbol;
                    let assetObject = new CreateCoinObject(element.name, element.symbol, element.image, element.id, element.current_price, element.price_change_percentage_24h, coinAlert, removeId);
                    assetsWatchList.push(assetObject);
                    let newPrice = (element.current_price).toFixed(2);
                    let changes = signAndColorDefinition(element.price_change_percentage_24h);
                    let marketCap = (element.market_cap/1000000000).toFixed(2);
                    let tableRow = `              
                           <tr class="${element.name}">
                                      <td>
                                            <div class="coin">
                                                  <img src=${element.image} class="icon">
                                                  <div style="margin-left:.5rem;text-transform:capitalize"><span class="assetName">${element.name}</span> <span class="symbol">${element.symbol}</span></div>
                                            </div>
                                      </td>
                                      <td class="hideColumn"></td>                       
                                      <td class="hideColumn currentPrice">£${newPrice} <span class='${changes[1]}'>${changes[0]}%</span></td>
                                      <td class="hideColumn">£ ${marketCap}B</td>                                    
                                      <td class="alert-status">${txt}</td>                                   
                                      <td><button class="removeAssetsFromWatchlist" value=${element.id} id=${removeId}>Remove</button></td>                                    
                            </tr>`;
                  document.getElementById(`assets`).insertAdjacentHTML('beforeend', tableRow);
                  let removeButton = document.querySelectorAll('.removeAssetsFromWatchlist');
                  removeButton[removeButton.length-1].addEventListener('click', removeAssetsFromWatchlist);
              }
        })      
        let message = `    <span class="closeBox">&times;</span>
                           <div class='formBox'>
                           <div class='image-container'>
                                <img src='images/welldone.png'>
                           </div>
                           <h2 style="margin-top:.2rem;letter-spacing:0.5px;font-weight:bold">Well Done!!</h2>
                           
                           <div class="message-coin" style="margin-top:1.5rem">
                                                  <img src=${assetImage} class="icon">
                                                  <div>${assetName} <span class="symbol">${assetSymbol}</span></div>
                           </div>
                          
                           <p style="font-size:0.7rem">(added to your watchlist)</p>
                           <p style="margin-top:1rem;font-size:0.7rem"><i class='far fa-bell'></i> Alert set @ ${upDown} £${targetPrice}</p>
                       </div>`;
        document.querySelector('.createAlert').removeEventListener('click', createAlert);
        document.querySelector('.modalBox').innerHTML = message; 
        document.querySelector('.modalBox .closeBox').addEventListener('click', function(){closeBox('.modalBox')})          
  }
  
  function clearInputField(){
        document.querySelectorAll('.addAssetToWatchlist').forEach(element => {
              element.addEventListener('click',addAssetToWatchlist);
        })
        clearInputBtn.removeEventListener('click', clearInputField);
        searchInput.value = "";
        coinList.innerHTML = "";
        searchInput.focus();
        clearInputBtn.style.display = "none";
  }
  
  function addStyleCenterHeader(){
      centerHeader.style.borderColor = 'blue';
      centerHeader.style.boxShadow = 'inset 0 0 2px #000000';
  }
  
  function removeStyleCenterHeader(){
      centerHeader.style.borderColor = '';
      centerHeader.style.boxShadow = '';
  }
  
  function CreateCoinObject(coinName, coinSymbol, coinLogo, coinId, coinPrice, coinChange, coinAlert, coinRemoveId) {
          this.coinName = coinName;
          this.coinSymbol = coinSymbol;
          this.coinLogo = coinLogo;
          this.coinId = coinId;
          this.coinPrice = coinPrice;
          this.coinChange = coinChange;
          this.coinAlert = coinAlert;
          this.coinRemoveId = coinRemoveId;
  }
  //================ API Call to get Prices(Coingecko API) Start ==================//
  
  function getCurrentPrice(){ 
    fetch(url).then(response => response.json()).then(response => updatePrice(response));
  }
  
  function getCurrentGlobalData(){
        fetch(url1).then(response => response.json()).then(response => updateGlobalData(response))
  }
  
  //================ API Call to get Prices(Coingecko API) End ==================//
  function updateGlobalData (globalData) {
     let marketCap =  globalData.data.total_market_cap.gbp / 1000000000;
     let marketCapChange = globalData.data.market_cap_change_percentage_24h_usd;
     let totalVolume = (globalData.data.total_volume.gbp / 1000000000).toFixed(2);
     let bitCap = (globalData.data.market_cap_percentage.btc).toFixed(2);
     let ethCap = globalData.data.market_cap_percentage.eth.toFixed(2);
     let change, changeClass, movement;
              let newCap  = (marketCap).toFixed(2);
                    if (Math.sign(marketCapChange) === 1) {
                          change = '+' + (marketCapChange).toFixed(2);
                          movement = 'fas fa-level-up-alt';
                          changeClass = 'upColor';
                    } else {
                          change = (marketCapChange).toFixed(2);
                          movement = 'fas fa-level-down-alt';
                          changeClass = 'downColor';
                    }
     let details = `<div class="market-cap"> <span class="boldFont">Total Market Cap: </span> <span class="lightBlue">£ ${newCap}B</span> <span class="${changeClass}">${change}%<i class="${movement}"></i></span></div>
                    <div class="dayVolume"> <span class="boldFont">24h Vol:</span> <span class="lightBlue">£ ${totalVolume}B</span>  </div>
                    <div class="dominance"> <span class="boldFont">Dominance:</span> <span class="lightBlue">BTC:</span> ${bitCap}%, <span class="lightBlue">ETH:</span> ${ethCap}%</div>`
     document.querySelector('.global-container .details').innerHTML = details;
  }
  
  //================ Update Prices Start ==================//
    function updatePrice(data) {     
        allAssets = data;
       for(let i = 0; i < 5; i++){
              let change, changeClass;
              let newPrice = (allAssets[i].current_price).toFixed(2);
                    if (Math.sign(allAssets[i].price_change_percentage_24h) === 1) {
                          change = '+' + (allAssets[i].price_change_percentage_24h).toFixed(2);
                          changeClass = 'asset-change gain';
                    } else {
                          change = (allAssets[i].price_change_percentage_24h).toFixed(2);
                          changeClass = 'asset-change loss';
                    }
                    let card = `                 
                             <div class="img" alt="1">
                                <img src=${allAssets[i].image}>
                             </div>
                             <div class="content">
                                   <div class="asset-symbol">${allAssets[i].symbol.toUpperCase()} <sup class='${changeClass}'>${change}%</sup></div>
                                   <div class="asset-price">£${newPrice}</div>                                
                             </div>                                
                   `
                   document.getElementsByClassName('card')[i].innerHTML = card;
              }
              $(".slider").owlCarousel({
                    loop: false,
                    autoplay: true,
                    autoplayTimeout: 3000,
                    dots:true,
                    responsiveClass: true,
                    responsive: {
                          0: {
                                items: 1
                          },
                          350: {
                                items: 2
                          },
                          600: {
                                items: 3
                       },
                          900: {
                                items: 4
                          }
                    }
              });
        if (assetsWatchList.length != 0) {
          for(let i = 0; i < assetsWatchList.length; i++){           
              data.forEach(element => {            
              if(element.id === assetsWatchList[i].coinId) {   
                    let change, changeClass;
                    let newPrice = (element.current_price).toFixed(2);
                    if (Math.sign(element.price_change_percentage_24h) === 1) {
                          change = '+' + (element.price_change_percentage_24h).toFixed(2);
                          changeClass = 'change1 gain';
                    } else {
                          change = (element.price_change_percentage_24h).toFixed(2);
                          changeClass = 'change1 loss';
                    }
                    let txt =  `£${newPrice} <span class='${changeClass}'>${change}%</span>`;
                    document.querySelectorAll(`.currentPrice`)[i].innerHTML = txt;
                  if(assetsWatchList[i].coinAlert.status === 'On'){                       
                          if(assetsWatchList[i].coinAlert.movement === 'above'){
                                   if(element.current_price >= assetsWatchList[i].coinAlert.target){
                                    updateAlertModalBox(i, 'is above',txt);
                                   }
                          } else {
                                 if(element.current_price <= assetsWatchList[i].coinAlert.target){                                   
                                   updateAlertModalBox(i, 'is below', txt); 
                          }                     
                       }                            
                 }   
              }
  
           });
        }
        }
  
    }
  
  
  //================ Update Prices End ==================//
  
  //================ Update Notifications and Price Alert Modal Start ==============//
  function updateAlertModalBox(num, words,text) {                        
                           num1++;
                           let nowTime = dateBuilder();
                           let alert = `<div class="alertBox">
                                                  <div><img src="images/alert.png" class="icons"></div>
                                                  <h3>Price Alert</h3>
                                                  <div class="date-time">${nowTime[1]} ${nowTime[0]}</div>
                                                  <p style="margin-top: 1rem;font-size:1rem;font-weight:600;color:#1ebba1">
                                                  <span style="text-transform:capitalize">${assetsWatchList[num].coinName}</span> (${assetsWatchList[num].coinSymbol.toUpperCase()}) ${words} £${assetsWatchList[num].coinAlert.target}
                                                  </p>
                                                  <p style="font-size:0.7rem"> Price @ the time: ${text} </p>    
                                        </div>
                                       `;
                            let icon = 'images/coin1.png';
                            let message = `${assetsWatchList[num].coinName} (${assetsWatchList[num].coinSymbol.toUpperCase()}) ${words} £${assetsWatchList[num].coinAlert.target}`;
                            let notification = new Notification('Price-alert',{icon: icon, body:message });
                            notification.onclick= function(event){
                                  event.preventDefault();
                                  window.open('http://127.0.0.1:5500/index.html', '_blank')
                            }
                            assetsWatchList[num].coinAlert.status = 'Triggered';
                            let assetRow = document.getElementsByTagName('TR')[num+1];                         
                            let priceTrigger = `<div class='status'>
                                                     <div class="state loss">Done <i class="fas fa-check"></i></div>                                               
                                                  </div>`;
                          assetRow.querySelector('.alert-status').innerHTML = priceTrigger; 
                          document.querySelector('.priceAlertModal .no-notifications').style.display= "none";                                  
                          document.querySelector('.priceAlertModal .alerts').insertAdjacentHTML('afterbegin',alert);
                          document.querySelector('.notifications .totalNotifications').innerText = num1;
                          document.querySelector('.notifications .totalNotifications').style.display = "block";                                            
  }
  
  //================ Update Notifications and Price Alert Modal End ==============//
  
  
  
  //================  Display data on UI after API Call Resolved Start ==================//
  function displayContent() {
        if(assetsWatchList.length === 0) {
              removeId = 0;
                              document.getElementsByClassName(`empty-table`)[0].style.display = 'block';
                              document.getElementsByClassName('assets-table')[0].style.display = 'none';
             } else {
                for(let i = 0; i < assetsWatchList.length; i++){            
                let text = `              
                           <tr class="${assetsWatchList[i].coinName}">
                                      <td>
                                            <div class="coin">
                                                  <img src=${assetsWatchList[i].coinLogo} class="icon">
                                                  <div style="margin-left:.5rem;text-transform:capitalize">${assetsWatchList[i].coinName} <span class="symbol">${assetsWatchList[i].coinSymbol}</span></div>
                                            </div>
                                      </td>
                                      <td></td>                       
                                      <td class="currentPrice"></td>                                    
                                      <td class="alert-status"> <div class="status">${assetsWatchList[i].priceAlert.state} <div class="target-price">${assetsWatchList[i].priceAlert.target}</div> </div></td>
                                      <td></td>
                                      <td><button class="removeAssetsFromWatchlist" value=${element.id} id=${removeId}><i class="fas fa-times-circle"></i> Remove</button></td>                                    
                            </tr>`;
                            document.getElementById(`assets`).insertAdjacentHTML('beforeend', text);
                            let removeButton = document.querySelectorAll('.removeAssetsFromWatchlist');
                            removeButton[removeButton.length-1].addEventListener('click', removeAssetsFromWatchlist);     
         }
             }
         addEvent();             
         setInterval(getCurrentPrice,1500); 
         getCurrentGlobalData();
         if(Notification.permission === "granted") {
              notificationBtn.classList.toggle('enable-btn');           
              notificationBtn.classList.toggle('onState');
            }       
           
  }
  displayContent();
  
  //================ Display data on UI after API Call Resolved Start ==================//
  
  
  
  //============== Alert Price Entry Form Close Function ==========================//
  
  function closeBox(modalBox){
              document.querySelector(modalBox).style.display = "none";
  }
  
  //============== Alert Price Entry Form Close Function ==========================//
  function emptyAlertModalBox(){
                    document.querySelector('.priceAlertModal .no-notifications').style.display= "";
                    document.querySelector('.priceAlertModal .alerts').innerHTML = '';
  }
  
  // =========== Date Builder Function Start ============= //
  
  function dateBuilder() {
        // For date
        let dateTime =[];
        var d = new Date();
        var date = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) +"-"+("0" + d.getDate()).slice(-2);
        
        let options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
        let date1 = new Date(date);
  
        dateTime.push(date1.toLocaleDateString('en-UK', options));
  
        //For time
           var am_pm = "am";
           var hour = d.getHours();
           if(hour>=12){
            am_pm = "pm";
           }
           if (hour == 0) {
             hour = 12;
           }
           if(hour > 12){
             hour = hour - 12;
          }
          if(hour < 10){
             hour = "0"+hour;
          }
  
          var minute = d.getMinutes();
            if (minute < 10){
            minute = "0"+minute;
          }
          dateTime.push(hour + ':' + minute + am_pm);
  
          return(dateTime);
  
  }
  
  // =========== Date Builder Function End ============= //
  
  
  // ========== Notifications Start ==========================//
  
  function askNotificationPermission(){
        function handlePermission(){
              if(Notification.permission === 'denied' || Notification.permission === 'default') {
                    document.getElementById('dropdown').style.display = 'flex';
                  } else {
                    notificationBtn.classList.toggle('enable-btn');
                    notificationBtn.classList.toggle('onState');
                  }               
        }
        if (!('Notification' in window)) {
              console.log("This browser does not support notifications.");
            } else {
              if(checkNotificationPromise()) {
                Notification.requestPermission()
                .then((permission) => {
                  handlePermission(permission);
                })
              } else {
                Notification.requestPermission(function(permission) {
                  handlePermission(permission);
                });
              }
            }
  }
  function checkNotificationPromise() {
        try {
          Notification.requestPermission().then();
        } catch(e) {
          return false;
        }
        return true;
      }
  })()
  
  