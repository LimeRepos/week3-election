import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useLibraryContract from "../hooks/useLibraryContract";

type USContract = {
  contractAddress: string;
  account: string;
};

export enum Leader {
  UNKNOWN,
  BIDEN,
  TRUMP
}

const USLibrary = ({ contractAddress }: USContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const libraryContract = useLibraryContract(contractAddress);
  const [bookAmount, setBookAmount] = useState<number>(0);
  const [bookList, setBookList] = useState([]);
  const [borrowedList, setBorrowedList] = useState([])
  const [bookName, setBookName] = useState("");
  const [bookCopies, setBookCopies] = useState(0);
  const [bookId, setBookId] = useState(0)
  const [retId, setRetId] = useState(0)
  const [name, setName] = useState<string | undefined>();
  const [votesBiden, setVotesBiden] = useState<number | undefined>();
  const [votesTrump, setVotesTrump] = useState<number | undefined>();
  const [stateSeats, setStateSeats] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [errRent, setErrRent] = useState(false);
  const [errRet, setErrRet] = useState(false);
  const [errAdd, setErrAdd] = useState(false);

  useEffect(() => {
    getBooks();
    setErrRent(false)
  },[])

  const getBooks = async () => {
    setBookList([])
    setBorrowedList([])
    const bookAmount = await libraryContract.booksInLibrary();
    console.log(bookAmount.toString())
    setBookAmount(bookAmount.toString())
    let name = ""
    let available = 0
    let res = ''
    for(let i = 0; i < bookAmount; i++){
      available = await libraryContract.availableUnits(i)
      name = await libraryContract.getName(i)
      setBookList(bookList => [...bookList, `ID: ${i} Name: ${name}, Available Copies:  ${available}`])
      if(await libraryContract.addressBookIdCopiesBorrowed(account,i)){
        setBorrowedList(borrowedList => [...borrowedList, `ID: ${i} Name: ${name}`])
      }
    }
  }

  const bookInput = (input) => {
    setBookName(input.target.value)
  }

  const numberInput = (input) => {
    setBookCopies(input.target.value)
  }

  const idInput = (input) => {
    setBookId(input.target.value)
  }

  const retBookId = (input) => {
    setRetId(input.target.value)
  }

  const submitBook = async () => {
    const tx = await libraryContract.addNewBook(bookName,bookCopies).catch(err => {setErrAdd(true)})
    if(tx){
      setErrAdd(false)
      setLoading(true)
      await tx.wait();
      resetForm();
    }
    
  }

  const rentBook = async () => {
    const tx = await libraryContract.borrowBook(bookId).catch(err => {setErrRent(true)})
    if (tx){
      setLoading(true)
      setErrRent(false)
      await tx.wait();
      resetForm();
    }
  }
  const returnBook = async () => {
    const tx = await libraryContract.returnBook(bookId).catch(err => {setErrRet(true)})
    if (tx){
      setLoading(true)
      setErrRet(false)
      await tx.wait();
      resetForm();
    }
  }

  const resetForm = async () => {
    setLoading(false)
    setErrRent(false)
    setBookName("");
    setBookCopies(0);
    setBookId(0)
    getBooks()
  }

  return (
    <div className="results-form">
    <p> Books In Library: {bookAmount}</p>
    <p>
      {bookList ? (bookList.map(elem => <p>{elem}</p>)):("")}

    </p>
    <p>----------------------------------------------------------------------</p>
    <p>Add New Book</p>
    <form>
      <label>
        Book Name:
        <input onChange={bookInput} value={bookName} type="text" name="name" />
      </label>
      <br></br>
      <br></br>
      <label>
        Amount of copies:
        <input onChange={numberInput} value={bookCopies} type="number" name="copies" />
      </label>
      <br></br>
      <br></br>
      {/* <input type="submit" value="Submit" /> */}
    </form>
    <div className="button-wrapper">
      <button onClick={submitBook}>Add Book</button>
    </div>
    {errAdd ? (<p>You need to be the library owner to do that</p>):(<></>)}
    <p>----------------------------------------------------------------------</p>
    <p>List of borrowed books by {account}</p>
    <p>
      {borrowedList ? (borrowedList.map(elem => <p>{elem}</p>)):("")}

    </p>
    <p>----------------------------------------------------------------------</p>
    <p>Rent a Book</p>
    <form>
      <label>
        Book ID:
        <input onChange={idInput} value={bookId} type="text" name="number" />
      </label>
      {/* <input type="submit" value="Submit" /> */}
    </form>
    <br></br>
      <br></br>
    <div className="button-wrapper">
      <button onClick={rentBook}>Rent</button>
    </div>
    {errRent ? (<p>You already have that book</p>):(<></>)}
    <div>
    <p>----------------------------------------------------------------------</p>
    <p>Return a Book</p>
    <form>
      <label>
        Book ID:
        <input onChange={retBookId} value={retId} name="number" />
      </label>
      {/* <input type="submit" value="Submit" /> */}
    </form>
    <br></br>
      <br></br>
    <div className="button-wrapper">
      <button onClick={returnBook}>Return</button>
    </div>
    {errRet ? (<p>You dont have that book</p>):(<></>)}
    <div>
    <p>----------------------------------------------------------------------</p>
    </div>
    {loading ? (<p>Waiting for tx</p>):(<></>)}
    </div></div>
  );
};

export default USLibrary;
