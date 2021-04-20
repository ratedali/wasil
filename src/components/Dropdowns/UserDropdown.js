import { createPopper } from "@popperjs/core";
import React, { Suspense } from "react";
import { useHistory } from "react-router";
import { useAuth, useFirestore, useFirestoreCollectionData, useUser } from "reactfire";

const UserDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <i className="fas fa-user"></i>
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <Suspense fallback={<MenuItem>...</MenuItem>}>
          <UserInfo />
        </Suspense>
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <Suspense fallback={<MenuItem>Sign Out</MenuItem>}>
          <SignOut />
        </Suspense>
      </div>
    </>
  );
};

function UserInfo() {
  const { data: user } = useUser();
  const ref = useFirestore()
    .collection(`staff`)
    .where('uid', '==', user?.uid);
  const { data: results } = useFirestoreCollectionData(ref);
  const { email, admin } = results[0];
  if (user == null) {
    return null;
  }
  return (
    <>
      <MenuItem>
        {email}
      </MenuItem>
      <MenuItem>
        {admin ? "Administrator" : "Regular User"}
      </MenuItem>
    </>
  );
}

function SignOut() {
  const auth = useAuth();
  const history = useHistory();
  const logout = async () => {
    await auth.signOut();
    history.replace('/auth')
  }
  return (
    <MenuItem onClick={logout}>Sign Out</MenuItem>
  );
}


function MenuItem({ onClick = () => { }, children }) {
  return (
    <a
      href="#pablo"
      className={
        "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      }
      onClick={(e) => { e.preventDefault(); onClick(); }}
    >
      {children}
    </a>
  );
}

export default UserDropdown;
