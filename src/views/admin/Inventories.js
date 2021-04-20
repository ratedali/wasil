import Card from "components/Cards/Card";
import LoadingPlaceholder from "components/Loading/LoadingPlaceholder";
import { Suspense, useState } from "react";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocData,
} from "reactfire";

export default function Inventories() {
  return (
    <div className="flex flex-wrap mt-4">
      <Suspense fallback={<LoadingCard />}>
        <InventoryList />
      </Suspense>
    </div>
  );
}

function InventoryList() {
  const query = useFirestore().collection("inventories").orderBy("name");
  const { data } = useFirestoreCollection(query);
  return data.docs.map((doc) => (
    <Suspense key={doc.id} fallback={<LoadingCard />}>
      <Inventory doc={doc} />
    </Suspense>
  ));
}

function Inventory({ doc }) {
  const {
    data: { name, gasoline, benzene },
  } = useFirestoreDocData(doc.ref);
  const [editing, setEditing] = useState(false);
  const [fuel, setFuel] = useState({ gasoline, benzene });
  const handleFuelChange = ({ target: { name, value } }) =>
    setFuel((fuel) => ({
      ...fuel,
      [name]: value,
    }));
  const edit = () => setEditing(true);
  const save = async () => {
    await doc.ref.update(fuel);
    setEditing(false);
  };
  return (
    <Card
      title={name}
      action={
        editing ? (
          <button
            type="button"
            className="bg-lightBlue-500 active:bg-lightBlue-600 text-white font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            onClick={save}
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            className="text-lightBlue-500 font-bold uppercase text-sm px-4 py-2 rounded hover:bg-lightBlue-300 hover:bg-opacity-30 active:bg-lightBlue-300 active:bg-opacity-60 outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            onClick={edit}
          >
            Edit
          </button>
        )
      }
    >
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Fuel
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Gasoline
                </label>
                <input
                  type="number"
                  name="gasoline"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  disabled={!editing}
                  onChange={handleFuelChange}
                  value={fuel.gasoline}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Benzene
                </label>
                <input
                  type="number"
                  name="benzene"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  disabled={!editing}
                  onChange={handleFuelChange}
                  value={fuel.benzene}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}

function LoadingCard() {
  return (
    <Card title={<LoadingPlaceholder />}>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Fuel
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Gasoline
                </label>
                <LoadingPlaceholder />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Benzene
                </label>
                <LoadingPlaceholder />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}
