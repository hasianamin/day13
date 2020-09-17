import React, {useState, useRef, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Header from '../../components/Header'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import {priceFormatter, API_URL} from '../../helpers/idrformat'
import axios from 'axios'
import {MdDeleteForever} from 'react-icons/md'
import {BiEdit} from 'react-icons/bi'
import Swal from 'sweetalert2'
import ReadMoreReact from 'read-more-react'
import './Admin.css'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 800,
  },
});

function StickyHeadTable(props) {
  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false)
  const {className} = props;
  
  const [addForm, setAddForm] = useState({
    namaTrip: useRef(),
    gambar:useRef(),
    tanggalMulai:useRef(),
    tanggalBerakhir:useRef(),
    harga:'',
    deskripsi:useRef()
  })
  
  const [editForm, setEditForm] = useState({
    namaTrip: useRef(),
    gambar:useRef(),
    tanggalMulai:useRef(),
    tanggalBerakhir:useRef(),
    harga:'',
    deskripsi:useRef()
  })
  
  const [indexEdit, setIndexEdit] = useState(0)
  const [product, setProduct] = useState([])
  
  useEffect(() => {
    axios.get(`${API_URL}/products`)
    .then((res) => {
      setProduct(res.data)
    }).catch((err)=> {
      console.log(err)
    })
  },[])
  
  const onHargaChange=(e)=>{
    if(e.target.value === ''){
      setAddForm({...addForm,harga:0})
    }
    if(Number(e.target.value)){
      if(addForm.harga===0){
        setAddForm({...addForm, harga:e.target.value[1]})
      }else{
        setAddForm({...addForm, harga:e.target.value})
      }
    }
  }

  const onHargaChangeEdit=(e)=>{
    if(e.target.value === ''){
      setEditForm({...editForm,harga:0})
    }
    if(Number(e.target.value)){
      if(editForm.harga===0){
        setEditForm({...editForm, harga:e.target.value[1]})
      }else{
        setEditForm({...editForm, harga:e.target.value})
      }
    }
  }

  const dateFormat=(n)=>{
    var today = new Date(n);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
    return today
  }

  const dateEditFormat=(n)=>{
    var today = new Date(n);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
  }
  
  const onAddDataClick = () => {
    var namaTrip = addForm.namaTrip.current.value
    var gambar = addForm.gambar.current.value
    var tanggalMulai = addForm.tanggalMulai.current.value
    var tanggalBerakhir = addForm.tanggalBerakhir.current.value
    var harga = addForm.harga
    var deskripsi = addForm.deskripsi.current.value
    var obj = {
      namaTrip,
      gambar,
      tanggalMulai: new Date(tanggalMulai).getTime(),
      tanggalBerakhir: new Date(tanggalBerakhir).getTime(),
      harga,
      deskripsi
    }
    if(obj.tanggalMulai > obj.tanggalBerakhir || obj.tanggalMulai<new Date().getTime()){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Wrong input information!'
      })
    } else{
      axios.post(`${API_URL}/products`,obj)
      .then(() => {
        Swal.fire(
          'Added!',
          'Your data has been added.',
          'success'
        )
        axios.get(`${API_URL}/products`)
        .then((res)=>{
          setProduct(res.data)
          setAddForm({...addForm, harga:''})
          toggle()
        }).catch((err)=>{
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const onEditClick = (id, index) => {
    setIndexEdit(index)
    setEditForm({...editForm,harga:product[index].harga})
    toggleEdit()
  }

  const onSaveEditClick = (id) => {
    var tanggalMulai = editForm.tanggalMulai.current.value
    var tanggalBerakhir = editForm.tanggalBerakhir.current.value
    var objedit= {
      namaTrip: editForm.namaTrip.current.value,
      gambar:editForm.gambar.current.value,
      tanggalMulai: new Date(tanggalMulai).getTime(),
      tanggalBerakhir: new Date(tanggalBerakhir).getTime(),
      harga: editForm.harga,
      deskripsi: editForm.deskripsi.current.value
    }
    axios.put(`${API_URL}/products/${id}`,objedit)
    .then(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Data has been changed',
        showConfirmButton: false,
        timer: 1500
      })
      axios.get(`${API_URL}/products`)
      .then((res)=>{
        setProduct(res.data)
        setEditForm({...editForm, harga:''})
        toggleEdit()
      }).catch((err)=> console.log(err))
    }).catch((err)=>console.log(err))
  }

  const onDeleteClick = (id, index) => {
    Swal.fire({
      title: `Are you sure you want to delete ${product[index].namaTrip}?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_URL}/products/${id}`)
        .then(()=>{
          axios.get(`${API_URL}/products`)
          .then((res)=>{
            setProduct(res.data)
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }).catch((err)=>console.log(err))
        }).catch((err)=>console.log(err))
      }
    })
  }

  const renderTable = () => {
    return product.map((val, index) => {
      return(
        <TableRow key={val.id}>
          <TableCell>{index+1}</TableCell>
          <TableCell>{val.namaTrip}</TableCell>
          <TableCell>
            <div style={{width:'200px'}}>
              <img alt='tes' width='100%' src={val.gambar}/>
            </div>
          </TableCell>
          <TableCell>{dateFormat(val.tanggalMulai)}</TableCell>
          <TableCell>{dateFormat(val.tanggalBerakhir)}</TableCell>
          <TableCell>{priceFormatter(val.harga)}</TableCell>
          <TableCell><ReadMoreReact text={val.deskripsi} min={30} ideal={40} readMoreText='read more...'/></TableCell>
          <TableCell>
            <span style={{fontSize:30, cursor:'pointer'}} onClick={()=>onDeleteClick(val.id, index)} className='text-danger mr-3'><MdDeleteForever/></span>
            <span style={{fontSize:30, cursor:'pointer'}} onClick={()=>onEditClick(val.id,index)} className='text-primary mr-3'><BiEdit/></span>
          </TableCell>
        </TableRow>
      )
    })
  }
  
  const toggle = () => setModal(!modal);
  const toggleEdit = () => setModalEdit(!modalEdit);

  return (
      <>
        <Modal isOpen={modal} toggle={toggle} className='modal-position'>
            <ModalHeader toggle={toggle}>Modal title</ModalHeader>
            <ModalBody>
              <form className="needs-validation" novalidate>
                <input type='text' ref={addForm.namaTrip} placeholder='Masukkan nama' className='form-control mb-2' required/>
                <input type='text' ref={addForm.gambar} placeholder='Masukkan gambar' className='form-control mb-2' required/>
                <label className='ml-1'>Tanggal mulai</label>
                <input type='date' ref={addForm.tanggalMulai} className='form-control mb-2' required/>
                <label className='ml-1'>Tanggal berakhir</label>
                <input type='date' ref={addForm.tanggalBerakhir} className='form-control mb-2' required/>
                <input type='text' onChange={onHargaChange} placeholder='Masukkan harga' value={addForm.harga} className='form-control mb-2' required/>
                <textarea ref={addForm.deskripsi} placeholder='Masukkan deskripsi' className='form-control mb-2' rows='3' required/>
              </form>
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={onAddDataClick}>Add</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
        {
          product.length?
          <Modal isOpen={modalEdit} toggle={toggleEdit} className='modal-position'>
                <ModalHeader toggle={toggleEdit}>edit data {product.length?product[indexEdit].namaTrip:''}</ModalHeader>
                <ModalBody>
                   <input type='text' defaultValue={product[indexEdit].namaTrip} ref={editForm.namaTrip} className='form-control mb-2'/>
                   <input type='text' defaultValue={product[indexEdit].gambar} ref={editForm.gambar} className='form-control mb-2'/>
                   <label className='ml-1'>
                     Tanggal mulai
                   </label>
                   <input type='date' defaultValue={dateEditFormat(product[indexEdit].tanggalMulai)}  ref={editForm.tanggalMulai} className='form-control mb-2'/>
                   <label className='ml-1'>
                     Tanggal berakhir
                   </label>
                   <input type='date' defaultValue={dateEditFormat(product[indexEdit].tanggalBerakhir)} ref={editForm.tanggalBerakhir} className='form-control mb-2'/>
                   <input type='text' onChange={onHargaChangeEdit}  value={editForm.harga} className='form-control mb-2'/>
                   <textarea defaultValue={product[indexEdit].deskripsi} className='form-control mb-2' ref={editForm.deskripsi}  cols="30" rows="7"></textarea>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=>onSaveEditClick(product[indexEdit].id)}>Save</Button>
                    <Button color="secondary" onClick={toggleEdit}>Cancel</Button>
                </ModalFooter>
            </Modal>
          :
          null
        }
        <Header/>
        <div className="px-5" style={{marginTop:'64px'}}>
            <div className="my-3 btn btn-outline-primary" onClick={toggle}>
                Add data
            </div>
            <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                      <TableCell>No.</TableCell>
                      <TableCell>Nama Trip</TableCell>
                      <TableCell style={{width:'200px'}}>Gambar</TableCell>
                      <TableCell>Tanggal Mulai</TableCell>
                      <TableCell>Tanggal Berakhir</TableCell>
                      <TableCell>Harga</TableCell>
                      <TableCell style={{width:'400px'}}>Deskripsi</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                   {renderTable()}
                </TableBody>
                </Table>
            </TableContainer>
            </Paper>
        </div>
      </>
  );
}

export default StickyHeadTable
