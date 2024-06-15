import DataFetch from "@/components/DataFetch";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import InventoryManagement from "@/components/InventoryManagement";





export default function Home() {
  
  return (
    <div>
     
      <DataFetch />
      <InventoryManagement />
    </div>
  );
}
