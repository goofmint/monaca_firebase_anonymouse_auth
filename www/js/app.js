var onDeviceReady = function() {
  // Firebaseの初期化
  var config = {
    apiKey: "API_KEY",
    authDomain: "AUTH_DOMAIN",
    databaseURL: "DATABASE_URL",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MESSAGING_SENDER_ID"
  };
  firebase.initializeApp(config);
  
  // Vueの処理 
	var vm = new Vue({
	  el: '#app',
	  // 初期データの設定
	  data: {
	  	user: {
	  		isLoggedIn: false,
	  		mailAddress: "",
	  		password: "",
	  		isAnonymous: false
	  	}
	  },
	  // デプロイ完了時のイベント
	  created: function() {
	  	// ユーザのステータスが変わったら通知
	  	var me = this;
	  	firebase.auth().onAuthStateChanged(function(user) {
	  		if (user) {
		  		me.user.isAnonymous = user.isAnonymous;
		  		me.user.mailAddress = user.email;
	  		}
	  		me.user.isLoggedIn = (user !== null);
	  	});
	  },
	  
	  // テンプレート
	  template: `
	  <div>
      <div class="center"> Firebase認証 </div>
	    <section style="margin: 10px;" v-if="user.isLoggedIn">
	    	<p v-if="user.isAnonymous">匿名ユーザ</p>
	    	<p v-else>{{user.mailAddress}}</p>
	    	<section style="margin: 10px;" v-if="user.isAnonymous">
	    		<div class="center">ユーザ化する</div>
		      <p>メールアドレス</p>
		      <p>
		        <input v-model="user.mailAddress" placeholder="メールアドレス" />
		      </p>
		      <p>パスワード</p>
		      <p>
		        <input v-model="user.password" placeholder="パスワード" type="password" />
		      </p>
			    <section style="margin: 10px;">
			      <button @click="anony_register">ユーザ登録</button>
			    </section>
	    	</section>
		    <section style="margin: 10px;">
		      <button @click="logout">ログアウト</button>
		    </section>
	    </section>
			<section v-else style="margin: 10px;">
	      <p>メールアドレス</p>
	      <p>
	        <input v-model="user.mailAddress" placeholder="メールアドレス" />
	      </p>
	      <p>パスワード</p>
	      <p>
	        <input v-model="user.password" placeholder="パスワード" type="password" />
	      </p>
	      <button @click="register">新規登録</button>
	      <button @click="login">ログイン</button>
	      <button @click="anonymouse">匿名ユーザ</button>
	    </section>
	  </div>`,
	  // イベント処理
	  methods: {
	  	// 登録処理
	  	register: function() {
	  		firebase.auth().createUserWithEmailAndPassword(this.user.mailAddress, this.user.password)
	  			.catch(function(error) {
        		alert(error.message);
	      	});
	  	},
	  	// ログイン処理
	  	login: function() {
	  		firebase.auth().signInWithEmailAndPassword(this.user.mailAddress, this.user.password)
	  			.catch(function(error) {
	  				alert(error.message);
	      	});
	  	},
	  	// ログアウト処理
	  	logout: function() {
	  		firebase.auth().signOut();
	  	},
	  	// 匿名認証を行う
	  	anonymouse: function() {
	  		firebase.auth().signInAnonymously()
	  			.catch(function(error) {
	  				alert(error.message);
	      	});
	  	},
	  	// 匿名ユーザを一般ユーザ化する
	  	anony_register: function() {
	  		var me = this;
	  		// 認証情報作成（新規ユーザ）
	  		var credential = firebase.auth.EmailAuthProvider.credential(this.user.mailAddress, this.user.password);
	  		// リンクさせる
	  		firebase.auth().currentUser.link(credential)
	  			.then(function(user) {
	  				// ステータス通知が行われないので注意
	  				me.user.mailAddress = user.email;
						me.user.isAnonymous = false;
						me.user.isLoggedIn = true;
					}, function(error) {
					  console.log("エラー", error);
					});
	  	}
	  }
	});
};
document.addEventListener(window.cordova ?"deviceready" : "DOMContentLoaded", onDeviceReady, false);
