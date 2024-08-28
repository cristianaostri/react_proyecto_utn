import './App.css';
import { useState, useEffect } from 'react'; // Cambié useState a useEffect para la carga inicial
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(""); // Cambiado a cadena vacía para manejar correctamente los campos de número
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState(""); // Cambiado a cadena vacía para manejar correctamente los campos de número
  const [id, setId] = useState(null); // Inicializado a null en lugar de undefined
  
  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleados] = useState([]);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre,
      edad,
      pais,
      cargo,
      anios
    }).then(() => {
      getEmpleados(); // Refresca la lista de empleados después de agregar uno nuevo
      limpiarCampos();
      Swal.fire({
        title: "<strong>Registro exitoso!</strong>",
        html: "<i>El empleado <strong>" + nombre + "</strong> fue registrado con éxito</i>",
        icon: "success",
        timer: 3000 // Corregido 'timner' a 'timer'
      });
    });
  };

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id,
      nombre,
      edad,
      pais,
      cargo,
      anios
    }).then(() => {
      getEmpleados(); // Refresca la lista de empleados después de actualizar uno
      limpiarCampos();
      Swal.fire({
        title: "<strong>Actualización exitosa!</strong>",
        html: "<i>El empleado <strong>" + nombre + "</strong> fue actualizado con éxito</i>",
        icon: "success",
        timer: 3000 // Corregido 'timner' a 'timer'
      });
    });
  };

  const deleteEmpleado = (val) => {
    Swal.fire({
      title: "Confirma que lo quiere eliminar",
      html: "<i>Realmente desea eliminar a <strong>" + val.nombre + "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, deseo eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          getEmpleados(); // Refresca la lista de empleados después de eliminar uno
          limpiarCampos(); // Limpia los campos del formulario

          Swal.fire({
            icon: 'Eliminado!',
            title: `${val.nombre} fue eliminado`,
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          });
        }).catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Hubo un error, no se logró eliminar, pruebe más tarde!",
            footer: JSON.parse(JSON.stringify(error)).message
          });
        });
      }
    });
  };

  const limpiarCampos = () => {
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnios("");
    setId(null); // Cambiado a null en lugar de cadena vacía
    setEditar(false);
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setPais(val.pais);
    setAnios(val.anios);
    setId(val.id);
  };

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleados(response.data);
    });
  };

  // Carga la lista de empleados cuando el componente se monta
  useEffect(() => {
    getEmpleados();
  }, []); // useEffect en lugar de useState para ejecutar el efecto en el montaje

  return (
    <div className="container-fluid">
      <div className="card text-center">
        <div className="card-header">
          GESTIÓN DE EMPLEADOS
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre:</span>
            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="form-control"
              placeholder="Ingrese el nombre"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad:</span>
            <input
              type="number"
              value={edad}
              onChange={(event) => setEdad(event.target.value)}
              className="form-control"
              placeholder="Ingrese su edad"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">País:</span>
            <input
              type="text"
              value={pais}
              onChange={(event) => setPais(event.target.value)}
              className="form-control"
              placeholder="Ingrese su país"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo:</span>
            <input
              type="text"
              value={cargo}
              onChange={(event) => setCargo(event.target.value)}
              className="form-control"
              placeholder="Ingrese su Cargo"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años de experiencia:</span>
            <input
              type="number"
              value={anios}
              onChange={(event) => setAnios(event.target.value)}
              className="form-control"
              placeholder="Ingrese los años"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <div className="card-footer text-muted">
          {editar ? (
            <div>
              <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
              <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
            </div>
          ) : (
            <button className='btn btn-success' onClick={add}>Registrar</button>
          )}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">País</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosList.map((val, key) => (
            <tr key={key}>
              <th scope="row">{val.id}</th>
              <td>{val.nombre}</td>
              <td>{val.edad}</td>
              <td>{val.pais}</td>
              <td>{val.cargo}</td>
              <td>{val.anios}</td>
              <td>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" onClick={() => editarEmpleado(val)} className="btn btn-info">Editar</button>
                  <button type="button" onClick={() => deleteEmpleado(val)} className="btn btn-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;