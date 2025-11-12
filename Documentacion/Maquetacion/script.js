// Script para calendario y eventos (ejemplo)
    const eventos = [
      { dia: "Lunes", evento: "Fútbol", hora: "18:00", cancha: "1" },
      { dia: "Miércoles", evento: "Zumba", hora: "20:00", cancha: "Salón A" },
      { dia: "Viernes", evento: "Padel", hora: "17:00", cancha: "3" }
    ];

    const calendarioDiv = document.getElementById("calendario");
    eventos.forEach(e => {
      const p = document.createElement("p");
      p.textContent = `${e.dia}: ${e.evento} / ${e.hora} / Cancha ${e.cancha}`;
      calendarioDiv.appendChild(p);
    });