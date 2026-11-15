import "./App.css";
import Thrift_Happens from "./components/Thrift Happens";

import { products } from "./data/data"


function App() {
  return (
    <>
      <img src="src/assets/images/logo.png" alt="" loading="lazy" height="100px" width="200px"/>
      <Thrift_Happens data={products} />
    </>
  );
}

export default App;
