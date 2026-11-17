class Contact {
  constructor(nombre, apellido, telefono) {
    this.nombre = typeof nombre === 'string' ? nombre.trim() : '';
    this.apellido = typeof apellido === 'string' ? apellido.trim() : '';
    this.telefono = typeof telefono === 'string' ? telefono.trim() : '';
  }

  isValid() {
    return this.nombre.length > 0 && this.apellido.length > 0 && this.telefono.length > 0;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono
    };
  }
}

module.exports = Contact;
