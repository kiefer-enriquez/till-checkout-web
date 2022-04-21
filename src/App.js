import React, { useState, useEffect } from "react";
import TillCheckout from "./components/tillCheckout";

export default function App() {
  let publicIntegrationKey = "pAjIxkGWLYpv1Yh3FUwF";

  return (
    <React.StrictMode>
      <TillCheckout publicIntegrationKey={publicIntegrationKey} />
    </React.StrictMode>
  );
}
