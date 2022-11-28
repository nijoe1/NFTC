import { useEffect, useState} from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
// used to display connected metamask account details
import Account from "components/Account";
import CreateCollectionForm from "components/CreateCollectionForm";
// used to index selected & available chains to create & trade tokens collections
import Chains from "components/Chains";
// used to fetch user account NFTs that he owns also provides the functionality to Create A marketplace sale!
import NFTBalance from "components/NFTBalance";
import NFTMarketTransactions2 from "components/NFTMarketTransactions2";
// Used to display tokens NFT from the internal marketplace collections or other provided collections
import NFTTokenIds from "components/NFTTokenIds";
// ui conmponents
import { Menu, Layout} from "antd";
import SearchCollections from "components/SearchCollections";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Text from "antd/lib/typography/Text";

// used to display the actions performed into the NFTC  Marketplace
const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "purple",
    marginTop: "120px",
    padding: "10px",
    
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "purple",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    
    
    
  },
  headerRight: {
    display: "flex",
    gap: "30px",
    background: "purple",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();



  const [inputValue, setInputValue] = useState("explore");

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <SearchCollections setInputValue={setInputValue}/>
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              display: "flex",
              background: "purple",
              fontSize: "16px",
              fontWeight: "900",
              marginLeft: "50px",
              width: "100%",
            }}
            defaultSelectedKeys={["nftMarket"]}
          >
            <Menu.Item key="nftMarket" onClick={() => setInputValue("explore")} >
              <NavLink to="/NFTMarketPlace">Explore</NavLink>
            </Menu.Item>
            <Menu.Item key="nft">
              <NavLink to="/nftBalance">Owned NFTs</NavLink>
            </Menu.Item>
            <Menu.Item key="transaction2s">
              <NavLink to="/Transactions2">Transactions</NavLink>
            </Menu.Item>
            <Menu.Item key="Form">
              <NavLink to="/Form">Transactions</NavLink>
            </Menu.Item>
          </Menu>
          <div style={styles.headerRight}>
            <Chains />
            <NativeBalance />
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route path="/NFTMarketPlace">
              <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue}/>
            </Route>
            <Route path="/Transactions2">
              <NFTMarketTransactions2 />
            </Route>
            <Route path="/Form">
              <CreateCollectionForm />
            </Route>
            
          </Switch>
          <Redirect to="/NFTMarketPlace" />
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
     
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
    <img
      style={{
        width: "180px",
        height: "40",
        borderRadius: "10px",
        fill: "none"
      }}
      src="https://nftstorage.link/ipfs/bafybeifgrtdpacneoy6mlhviqhf6jf2iqo4hzlfb3ghs23dmjgxtdxibne"
    >
      
    </img>
    

  </div>
);

export default App;
