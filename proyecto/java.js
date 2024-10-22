let alumnos = [];

function limpiarCampos() {
    document.getElementById("preinscripcion-form").reset();
    document.getElementById("curp").value = "";
}

function generarCURP() {
    // Obtener valores de los campos
    var primerApellido = document.getElementById("primer-apellido").value.trim().toUpperCase();
    var segundoApellido = document.getElementById("segundo-apellido").value.trim().toUpperCase();
    var nombres = document.getElementById("nombres").value.trim().toUpperCase();
    var sexo = document.getElementById("sexo").value.toUpperCase();
    var fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    var entidadNacimiento = document.getElementById("entidad-nacimiento").value.trim().toUpperCase();

    if (primerApellido && segundoApellido && nombres && sexo && fechaNacimiento && entidadNacimiento) {
        // Obtener aÃ±o, mes y dÃ­a de la fecha de nacimiento
        var anio = fechaNacimiento.substring(2, 4);
        var mes = fechaNacimiento.substring(5, 7);
        var dia = fechaNacimiento.substring(8, 10);

        // Funciones auxiliares para obtener la primera vocal interna y consonante interna
        function primeraVocalInterna(palabra) {
            var vocales = "AEIOU";
            for (var i = 1; i < palabra.length; i++) {
                if (vocales.indexOf(palabra[i]) !== -1) {
                    return palabra[i];
                }
            }
            return "X"; // En caso de no encontrar vocal interna
        }

        function primeraConsonanteInterna(palabra) {
            var consonantes = "BCDFGHJKLMNPQRSTVWXYZ";
            for (var i = 1; i < palabra.length; i++) {
                if (consonantes.indexOf(palabra[i]) !== -1) {
                    return palabra[i];
                }
            }
            return "X"; // En caso de no encontrar consonante interna
        }

        // Excepciones para nombres comunes
        var nombrePartes = nombres.split(" ");
        var nombre = nombrePartes[0];
        if (nombre === "MARIA" || nombre === "JOSE" || nombre === "MA" || nombre === "J") {
            nombre = nombrePartes[1];
        }

        // CÃ³digos de entidad federativa
        var entidades = {
            "AGUASCALIENTES": "AS",
            "BAJA CALIFORNIA": "BC",
            "BAJA CALIFORNIA SUR": "BS",
            "CAMPECHE": "CC",
            "COAHUILA": "CL",
            "COLIMA": "CM",
            "CHIAPAS": "CS",
            "CHIHUAHUA": "CH",
            "DISTRITO FEDERAL": "DF",
            "DURANGO": "DG",
            "GUANAJUATO": "GT",
            "GUERRERO": "GR",
            "HIDALGO": "HG",
            "JALISCO": "JC",
            "MEXICO": "MC",
            "MICHOACAN": "MN",
            "MORELOS": "MS",
            "NAYARIT": "NT",
            "NUEVO LEON": "NL",
            "OAXACA": "OC",
            "PUEBLA": "PL",
            "QUERETARO": "QT",
            "QUINTANA ROO": "QR",
            "SAN LUIS POTOSI": "SP",
            "SINALOA": "SL",
            "SONORA": "SR",
            "TABASCO": "TC",
            "TAMAULIPAS": "TS",
            "TLAXCALA": "TL",
            "VERACRUZ": "VZ",
            "YUCATAN": "YN",
            "ZACATECAS": "ZS",
            "NACIDO EN EL EXTRANJERO": "NE"
        };

        var entidad = entidades[entidadNacimiento] || "NE";

        // Generar CURP
        var curp = primerApellido.charAt(0) + primeraVocalInterna(primerApellido) +
                   segundoApellido.charAt(0) + nombre.charAt(0) +
                   anio + mes + dia + (sexo === "MASCULINO" ? "H" : "M") + entidad +
                   primeraConsonanteInterna(primerApellido) + primeraConsonanteInterna(segundoApellido) +
                   primeraConsonanteInterna(nombre);

        // Mostrar CURP en el campo correspondiente
        document.getElementById("curp").value = curp;
    } else {
        document.getElementById("curp").value = "";
    }
}

function guardarDatos() {
    var primerApellido = document.getElementById("primer-apellido").value.trim();
    var segundoApellido = document.getElementById("segundo-apellido").value.trim();
    var nombres = document.getElementById("nombres").value.trim();
    var sexo = document.getElementById("sexo").value;
    var fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    var entidadNacimiento = document.getElementById("entidad-nacimiento").value.trim();
    var curp = document.getElementById("curp").value;
    var comprobantePago = document.getElementById("comprobante-pago").files[0];

    if (primerApellido && segundoApellido && nombres && sexo && fechaNacimiento && entidadNacimiento && curp && comprobantePago) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var nuevoAlumno = {
                curp: curp,
                primerApellido: primerApellido,
                segundoApellido: segundoApellido,
                nombres: nombres,
                sexo: sexo,
                fechaNacimiento: fechaNacimiento,
                entidadNacimiento: entidadNacimiento,
                comprobantePago: e.target.result,
                pagoValidado: false
            };

            alumnos.push(nuevoAlumno);
            actualizarTablaAlumnos();
            limpiarCampos();
            alert("Datos guardados correctamente.");
        };
        reader.readAsDataURL(comprobantePago);
    } else {
        alert("Por favor complete todos los campos.");
    }
}

function verificarPago() {
    var curp = document.getElementById("verificar-curp").value.trim().toUpperCase();
    var alumno = alumnos.find(alumno => alumno.curp === curp);

    if (alumno) {
        document.getElementById("alumno-detalles").innerText =
            `Nombre: ${alumno.nombres} ${alumno.primerApellido} ${alumno.segundoApellido}\n` +
            `Sexo: ${alumno.sexo}\n` +
            `Fecha de Nacimiento: ${alumno.fechaNacimiento}\n` +
            `Entidad de Nacimiento: ${alumno.entidadNacimiento}`;
        document.getElementById("comprobante-img").src = alumno.comprobantePago;
        document.getElementById("comprobante-img").style.display = 'block';
        document.getElementById("alumno-info").style.display = 'block';
        document.getElementById("validar-pago").checked = alumno.pagoValidado;
    } else {
        alert("Alumno no encontrado.");
    }
}

function guardarEstatusPago() {
    var curp = document.getElementById("verificar-curp").value.trim().toUpperCase();
    var alumno = alumnos.find(alumno => alumno.curp === curp);

    if (alumno) {
        alumno.pagoValidado = document.getElementById("validar-pago").checked;
        alert("Estatus de pago guardado correctamente.");
        actualizarTablaAlumnos();
        document.getElementById("alumno-info").style.display = 'none';
        document.getElementById("verificar-curp").value = '';
    } else {
        alert("Alumno no encontrado.");
    }
}

function actualizarTablaAlumnos() {
    var tbody = document.getElementById("alumnos-body");
    tbody.innerHTML = "";

    alumnos.forEach(alumno => {
        var tr = document.createElement("tr");
        var tdCurp = document.createElement("td");
        tdCurp.innerText = alumno.curp;
        var tdNombre = document.createElement("td");
        tdNombre.innerText = `${alumno.nombres} ${alumno.primerApellido} ${alumno.segundoApellido}`;
        var tdEstatusPago = document.createElement("td");
        tdEstatusPago.innerText = alumno.pagoValidado ? "Pagado" : "Pendiente";

        tr.appendChild(tdCurp);
        tr.appendChild(tdNombre);
        tr.appendChild(tdEstatusPago);
        tbody.appendChild(tr);
    });
}

document.getElementById("primer-apellido").addEventListener("input", generarCURP);
document.getElementById("segundo-apellido").addEventListener("input", generarCURP);
document.getElementById("nombres").addEventListener("input", generarCURP);
document.getElementById("sexo").addEventListener("change", generarCURP);
document.getElementById("fecha-nacimiento").addEventListener("change", generarCURP);
document.getElementById("entidad-nacimiento").addEventListener("input", generarCURP);