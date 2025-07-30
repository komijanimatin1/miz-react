<template>
  <section>
    <webview
      id="webview_login"
      frameborder="0"
      enableblinkfeatures="PreciseMemoryInfo, CSSVariables"
      autosize="on"
      :partition="'persist:'+getLoginPartition()"
      :preload="pathStore.getBasicPath() + '\\preload.mjs'"
      src="https://fanap.mizbunny.com/apps/mizBunny_login"
    >
      <!-- @did-navigate-in-page="onDidNavigateInPage" -->
      <!-- src="https://fanap.mizbunny.com/apps/mizBunny_login/?isLauncherLogin=true&launcherProfileUpdated=true" -->
      <!-- src="https://betaapp.fanapmed.com/login/?isLauncherLogin=true&launcherProfileUpdated=true" -->
    </webview>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { getLauncherProfile } from "../../composables/GetProfile";
import { useAuthStore } from "../../stores/Authentication";
import axios from "axios";
import { launcherApi } from "../../../axios";
import { usePathStore } from "../../stores/path";

const router = useRouter();
const profile = getLauncherProfile();
const authStore = useAuthStore();
const pathStore = usePathStore();

const emit = defineEmits(["go-welcome"]);


const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

const getLoginPartition = () => {
  let temp=localStorage.getItem("LoginPartition");
  if(temp){
  }
  else{
    temp=uuidv4();
    localStorage.setItem("LoginPartition",temp);
  } 
  // console.info("p: "+temp);
  return temp; 
}

const onLogingHappened = async (accessToken, refreshToken) => {
  // window.ipcRenderer.clearPartition("persist:weblogin");
  debugger
  if(!localStorage.getItem("LoginPartition")){
    //console.info("user already logged.");
    return;
  }
  
  const tempPartition=getLoginPartition();
  // console.log("temp part is : "+tempPartition);
  localStorage.removeItem("LoginPartition");


  if (accessToken && refreshToken) {
    // todo
    // todo: fix later

    sysBunny.token = accessToken;
    sysBunny.refreshToken = refreshToken;
    // const teamsAndApps = await sysBunny.getTeamsAndApps();
    const profile = await sysBunny.getProfile();
    //todo mizBunny add getProfile
    const tempAccount = {
      firstName: profile.name,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      username: profile.username,
      partition:tempPartition,
      pin: null,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    console.log(JSON.stringify(tempAccount))
    debugger
    authStore.setActiveAccount(tempAccount);
    try {
      // todo check if changes, makes problem!
      //   const response = await launcherApi.get("Workspace/GetWorkspaceProfile");
      //   authStore.setActiveAccount(response.data.data.profile);
      // console.log(response);
    } catch (error) {
      console.error(error);
      // if (error?.response?.status === 401) {
      //   authStore.logout();
      // }
    }

    const phoneNumber = authStore.activeAccount.phoneNumber;
    const firstName = authStore.activeAccount.firstName;
    const lastName = authStore.activeAccount.lastName;
    const partition = authStore.activeAccount.partition;
    // get profile => create user object
    const newAccount = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      partition:partition,
      pin: null,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    authStore.newAccount(newAccount);
    authStore.setActiveAccount(newAccount);
    // window.ipcRenderer.clearPartition("persist:weblogin");
    // localStorage.setItem("accessToken", accessToken);
    // localStorage.setItem("refreshToken", refreshToken);

    webview_login.style.display = "none";
    // router.replace({ name: "dashboard" });
    emit("go-welcome");
  } else if (urlParsed[1]?.includes("profileUpdated")) {
    alert("profile updated");
  }
};

onMounted(() => {
  let webview_login = document.getElementById("webview_login");
  let iframe = webview_login.shadowRoot.querySelector("iframe");
  iframe.style.height = "100%";
  webview_login.style.display = "block";

  webview_login.addEventListener("dom-ready", () => {
    //webview_login.openDevTools();
    // Post data to the webview_login (login-app)
    // const dataToSend = { token: "12345", username: "john_doe" };
    // webview_login.contentWindow.postMessage(dataToSend, "*");

    // Receive message from the child and update the <h1> tag
    window.ipcRenderer.receiveMessage((data) => {
      if (data.origin === "mizBunnyApp") {
        onLogingHappened(data.data.token, data.data.refreshToken);
      }
    });

    // Send message to the child via the webview
    setTimeout(() => {
      webview_login.send("message-from-parent", "message from parent to child"); // Send message to child
    }, 2000);
  });
});
</script>
