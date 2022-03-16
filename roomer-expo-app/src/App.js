import React from "react";
import { registerRootComponent } from "expo";

import Navigator from "./navigator.js";
import Amplify from 'aws-amplify'
import awsconfig from './aws-exports'
Amplify.configure(awsconfig);

export default function App() {
  return <Navigator />;
}

registerRootComponent(App);
