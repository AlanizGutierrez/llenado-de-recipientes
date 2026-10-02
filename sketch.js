/*
  Código generado con apoyo del Tutor IA de Simuladores Matemáticos FerMat,
  Gem elaborado por el Taller FerMat, Departamento de Matemática, UMCE.

  Diseñador: Prof. Iván Pérez
  Desarrolladores: Catherine Gallardo & Alaniz Gutiérrez
  Uso pedagógico y adaptado a p5.js para ejecución web.
*/

// --- ESTADOS DEL SIMULADOR ---
let pantalla = 1; // 1: Seleccion, 2: Prediccion, 3: Dibujo Hipotesis, 4: Simulacion

// Opciones de recipientes:
// 0: Cilindro, 1: Cono Invertido, 2: Esfera, 3: Prisma Rectangular,
// 4: Cono Normal, 5: Doble Cono, 6: Tetraedro
let recipiente1 = 0; // Recipiente 1 (Azul)
let recipiente2 = 2; // Recipiente 2 (Rojo)
let prediccion = -1; // 0: R1, 1: R2, 2: Ambos a la vez

// Dibujo de hipótesis (Gráfico manual trazado por los estudiantes)
let boceto1 = []; // Puntos normalizados (u, v) para R1
let boceto2 = []; // Puntos normalizados (u, v) para R2
let curvaActiva = 1; // 1: Lápiz R1 (Azul), 2: Lápiz R2 (Rojo), 3: Goma de Borrar
let radioBorrador = 0.04; // Radio de borrado en coordenadas normalizadas (u, v)

// Control de validación de hipótesis en Pantalla 4
let mostrarValidacion = false; // Se activa por botón

// --- PARAMETROS MATEMATICOS Y FISICOS ---
let H = 160;              // Altura total de los recipientes en píxeles
let V_total = 100000;     // Volumen total fijo (px^3)
let Q = 250;              // Caudal constante (px^3 por fotograma)

let t = 0;                // Tiempo transcurrido (fotogramas)
let V_actual = 0;         // Volumen acumulado en instante t
let simulando = false;  // Estado de la animación

// Historial para graficar h(t) vs t
let h1_hist = [];
let h2_hist = [];
let t_hist = [];

// Control de deslizador (Slider)
let arrastrandoSlider = false;
let sliderX = 650, sliderY = 40, sliderW = 180;

function setup() {
  let canvas = createCanvas(800, 500); // Dimensiones del lienzo
  canvas.parent('simulador-container'); // ID del contenedor HTML si aplica
  
  pixelDensity(displayDensity());
  let contenedor = document.getElementById('simulador-container');
  let ancho = contenedor.clientWidth;
  let alto = contenedor.clientHeight;

  let canvas = createCanvas(ancho, alto);
  canvas.parent('simulador-container');
  pixelDensity(displayDensity());
createCanvas(800, 600);
  textFont('Arial'); // O 'sans-serif', 'Verdana', 'Georgia', 'Courier New'
}

function draw() {
  background(255);
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text("Tiempo t: 10 s", 50, 50);
}

function windowResized() {
  let contenedor = document.getElementById('simulador-container');
  resizeCanvas(contenedor.clientWidth, contenedor.clientHeight);
}

function draw() {
  background(245);
  
  if (pantalla === 1) {
    dibujarPantalla1();
  } else if (pantalla === 2) {
    dibujarPantalla2();
  } else if (pantalla === 3) {
    dibujarPantalla3_Dibujo();
  } else if (pantalla === 4) {
    dibujarPantalla4_Simulacion();
  }
}

// ==========================================
// PANTALLA 1: SELECCION DE RECIPIENTES
// ==========================================
function dibujarPantalla1() {
  fill(30);
  textSize(19);
  textAlign(CENTER);
  text("PANTALLA 1: Selecciona dos recipientes para comparar", width/2, 28);
  
  fill(80);
  textSize(13);
  text("Los recipientes tienen igual volumen y altura total", width/2, 48);
  
  let nombres = [
    "1. Cilindro", "2. Cono Invertido", "3. Esfera", "4. Prisma Rect.",
    "5. Cono Normal", "6. Doble Cono", "7. Tetraedro"
  ];
  
  for (let i = 0; i < 7; i++) {
    let col = i % 4;
    let row = floor(i / 4);
    let x = 45 + col * 205;
    let y = 62 + row * 192;
    dibujarTarjetaRecipiente(x, y, 190, 180, i, nombres[i]);
  }
  
  fill(60);
  textSize(13);
  text("Recipiente 1 (Azul) vs Recipiente 2 (Rojo)", width/2, 462);

  fill(40, 120, 220);
  rect(width/2 - 80, 480, 160, 42, 10);
  fill(255);
  textSize(16);
  text("Siguiente ->", width/2, 506);

  fill(90);
  textSize(12);
  text("Creado por: Catherine Gallardo & Alaniz Gutiérrez con ayuda de tutor IA", width/2, 552);
}

function dibujarTarjetaRecipiente(x, y, w, h, tipo, titulo) {
  let esR1 = (recipiente1 === tipo);
  let esR2 = (recipiente2 === tipo);
  
  stroke(esR1 ? color(40, 120, 220) : (esR2 ? color(220, 60, 60) : 200));
  strokeWeight((esR1 || esR2) ? 3 : 1);
  fill(255);
  rect(x, y, w, h, 8);
  
  fill(50);
  noStroke();
  textSize(14);
  textAlign(CENTER);
  text(titulo, x + w/2, y + 25);
  
  dibujarMiniesquema(x + w/2, y + 68, tipo);
  
  fill(esR1 ? color(40, 120, 220) : color(230));
  rect(x + 10, y + 120, w/2 - 15, 35, 5);
  fill(esR1 ? 255 : 80);
  textSize(11);
  text(esR1 ? "R1 [X]" : "Elegir R1", x + 10 + (w/2 - 15)/2, y + 142);
  
  fill(esR2 ? color(220, 60, 60) : color(230));
  rect(x + w/2 + 5, y + 120, w/2 - 15, 35, 5);
  fill(esR2 ? 255 : 80);
  textSize(11);
  text(esR2 ? "R2 [X]" : "Elegir R2", x + w/2 + 5 + (w/2 - 15)/2, y + 142);
}

function dibujarMiniesquema(x, y, tipo) {
  stroke(100);
  strokeWeight(1.5);
  noFill();
  let sz = 35;
  
  if (tipo === 0) {
    ellipse(x, y - sz/2, sz*0.66, sz*0.25);
    ellipse(x, y + sz/2, sz*0.66, sz*0.25);
    line(x - sz*0.33, y - sz/2, x - sz*0.33, y + sz/2);
    line(x + sz*0.33, y - sz/2, x + sz*0.33, y + sz/2);
  } else if (tipo === 1) {
    ellipse(x, y - sz/2, sz, sz*0.3);
    line(x - sz/2, y - sz/2, x, y + sz/2);
    line(x + sz/2, y - sz/2, x, y + sz/2);
  } else if (tipo === 2) {
    ellipse(x, y, sz, sz);
    ellipse(x, y, sz, sz*0.35);
  } else if (tipo === 3) {
    rect(x - sz/2, y - sz/3, sz*0.7, sz*0.7);
    line(x - sz/2, y - sz/3, x - sz/4, y - sz/2);
    line(x + sz*0.2, y - sz/3, x + sz*0.45, y - sz/2);
    line(x + sz*0.2, y + sz*0.37, x + sz*0.45, y + sz*0.2);
    line(x - sz/4, y - sz/2, x + sz*0.45, y - sz/2);
    line(x + sz*0.45, y - sz/2, x + sz*0.45, y + sz*0.2);
  } else if (tipo === 4) {
    ellipse(x, y + sz/2, sz, sz*0.3);
    line(x - sz/2, y + sz/2, x, y - sz/2);
    line(x + sz/2, y + sz/2, x, y - sz/2);
  } else if (tipo === 5) {
    let rC = 3;
    ellipse(x, y - sz/2, sz, sz*0.25);
    ellipse(x, y + sz/2, sz, sz*0.25);
    ellipse(x, y, rC*2, rC*0.8);
    line(x - sz/2, y - sz/2, x - rC, y);
    line(x + sz/2, y - sz/2, x + rC, y);
    line(x - sz/2, y + sz/2, x - rC, y);
    line(x + sz/2, y + sz/2, x + rC, y);
  } else if (tipo === 6) {
    triangle(x - sz/2, y + sz/3, x + sz/2, y + sz/3, x + sz*0.1, y + sz/2);
    line(x - sz/2, y + sz/3, x, y - sz/2);
    line(x + sz/2, y + sz/3, x, y - sz/2);
    line(x + sz*0.1, y + sz/2, x, y - sz/2);
  }
}

// ==========================================
// PANTALLA 2: PREDICCION CUALITATIVA
// ==========================================
function dibujarPantalla2() {
  fill(30);
  textSize(22);
  textAlign(CENTER);
  text("PANTALLA 2: ¿Cuál recipiente crees que se llenará primero?", width/2, 50);
  
  let nom1 = obtenerNombreRecipiente(recipiente1);
  let nom2 = obtenerNombreRecipiente(recipiente2);
  
  let opciones = ["Recipiente 1 (" + nom1 + ")", "Recipiente 2 (" + nom2 + ")", "Ambos al mismo tiempo"];
  for (let i = 0; i < 3; i++) {
    stroke(prediccion === i ? color(40, 120, 220) : 200);
    strokeWeight(prediccion === i ? 3 : 1);
    fill(255);
    rect(width/2 - 200, 130 + i * 80, 400, 55, 8);
    
    fill(40);
    noStroke();
    textSize(16);
    text(opciones[i], width/2, 163 + i * 80);
  }
  
  if (prediccion !== -1) {
    fill(40, 160, 80);
    rect(width/2 - 100, 420, 200, 45, 10);
    fill(255);
    textSize(16);
    text("Ir al Dibujo ->", width/2, 448);
  }
}

// ==========================================
// PANTALLA 3: DIBUJO DE HIPOTESIS DE LA GRAFICA h(t)
// ==========================================
function dibujarPantalla3_Dibujo() {
  fill(30);
  textSize(20);
  textAlign(CENTER);
  text("PANTALLA 3: Dibuja tu hipótesis de la gráfica h(t) vs t", width/2, 35);
  
  fill(80);
  textSize(13);
  text("Usa los lápices para trazar hipótesis o la goma de borrar para corregir tramos.", width/2, 58);
  
  dibujarBotonControl(30, 80, 180, 35, "Lápiz R1 (Azul)", curvaActiva === 1 ? color(40, 120, 220) : color(220));
  if (curvaActiva === 1) { fill(40, 120, 220); rect(215, 80, 8, 35, 2); }
  
  dibujarBotonControl(30, 125, 180, 35, "Lápiz R2 (Rojo)", curvaActiva === 2 ? color(220, 60, 60) : color(220));
  if (curvaActiva === 2) { fill(220, 60, 60); rect(215, 125, 8, 35, 2); }

  dibujarBotonControl(30, 170, 180, 35, "Goma de Borrar", curvaActiva === 3 ? color(230, 160, 40) : color(220));
  if (curvaActiva === 3) { fill(230, 160, 40); rect(215, 170, 8, 35, 2); }
  
  dibujarBotonControl(30, 220, 180, 30, "Borrar Trazo R1", color(230));
  dibujarBotonControl(30, 260, 180, 30, "Borrar Trazo R2", color(230));
  dibujarBotonControl(30, 300, 180, 30, "Borrar Todo", color(230));
  
  fill(40, 160, 80);
  rect(30, 420, 180, 45, 10);
  fill(255);
  textSize(15);
  textAlign(CENTER);
  text("Iniciar Simulación ->", 120, 448);

  let gx = 250, gy = 90, gw = 610, gh = 420;
  fill(255); stroke(180); strokeWeight(1);
  rect(gx, gy, gw, gh, 8);
  
  let x0 = gx + 55, x1 = gx + gw - 25;
  let y0 = gy + gh - 45, y1 = gy + 25;
  
  let t_max = V_total / Q;
  let divY = 8;
  let divX = 8;
  
  stroke(230); strokeWeight(1);
  for (let i = 0; i <= divY; i++) {
    let y_grid = map(i, 0, divY, y0, y1);
    line(x0, y_grid, x1, y_grid);
    fill(90); textSize(10); textAlign(RIGHT, CENTER);
    text(floor(i * H / divY), x0 - 6, y_grid);
  }
  
  for (let j = 0; j <= divX; j++) {
    let x_grid = map(j, 0, divX, x0, x1);
    line(x_grid, y0, x_grid, y1);
    textAlign(CENTER, TOP);
    text(floor(j * t_max / divX), x_grid, y0 + 6);
  }
  
  stroke(80); strokeWeight(2);
  line(x0, y0, x1, y0);
  line(x0, y0, x0, y1);
  
  fill(50); textSize(12); textAlign(CENTER);
  text("Tiempo (t)", (x0 + x1)/2, y0 + 26);
  textAlign(RIGHT);
  text("Altura h(t)", x0 - 25, (y0 + y1)/2);
  
  textAlign(RIGHT); textSize(12);
  fill(40, 120, 220); text("R1: " + obtenerNombreRecipiente(recipiente1), gx + gw - 20, gy + 30);
  fill(220, 60, 60);  text("R2: " + obtenerNombreRecipiente(recipiente2), gx + gw - 20, gy + 48);
  
  dibujarTrazoNormalizado(boceto1, x0, x1, y0, y1, color(40, 120, 220), 3);
  dibujarTrazoNormalizado(boceto2, x0, x1, y0, y1, color(220, 60, 60), 3);

  if (curvaActiva === 3 && mouseX >= x0 && mouseX <= x1 && mouseY >= y1 && mouseY <= y0) {
    stroke(230, 100, 40, 180);
    strokeWeight(1.5);
    fill(255, 200, 150, 80);
    let pxRadio = radioBorrador * (x1 - x0);
    ellipse(mouseX, mouseY, pxRadio * 2, pxRadio * 2);
  }
}

// ==========================================
// PANTALLA 4: SIMULACION Y GRAFICO COMPARATIVO
// ==========================================
function dibujarPantalla4_Simulacion() {
  if (simulando && V_actual < V_total) {
    V_actual += Q;
    t += 1;
    if (V_actual > V_total) V_actual = V_total;
    
    let h1 = calcularAltura(recipiente1, V_actual);
    let h2 = calcularAltura(recipiente2, V_actual);
    h1_hist.push(h1);
    h2_hist.push(h2);
    t_hist.push(t);
  }
  
  fill(30);
  textSize(18);
  textAlign(LEFT);
  text("PANTALLA 4: Simulación de Llenado y Comparación", 30, 35);
  
  let sliderBloqueado = (simulando || V_actual > 0);

  stroke(sliderBloqueado ? 200 : 180);
  strokeWeight(4);
  line(sliderX, sliderY, sliderX + sliderW, sliderY);
  let handleX = map(H, 80, 220, sliderX, sliderX + sliderW);
  
  fill(sliderBloqueado ? color(160) : color(40, 120, 220));
  noStroke();
  ellipse(handleX, sliderY, 16, 16);
  
  fill(sliderBloqueado ? 120 : 50);
  textSize(12);
  textAlign(CENTER);
  let textoSlider = "Altura H = " + floor(H) + " px" + (sliderBloqueado ? " (Bloqueado)" : "");
  text(textoSlider, sliderX + sliderW/2, sliderY - 12);

  dibujarBotonControl(30, 50, 90, 30, simulando ? "Pausar" : "Iniciar", color(220));
  dibujarBotonControl(130, 50, 90, 30, "Reiniciar", color(220));
  dibujarBotonControl(230, 50, 90, 30, "Volver", color(220));
  
  let colBotonValid = mostrarValidacion ? color(40, 160, 80) : color(220);
  dibujarBotonControl(330, 50, 130, 30, mostrarValidacion ? "Ocultar Valid." : "Validar Hipótesis", colBotonValid);

  let baseEjeY = 340;
  let h1_curr = calcularAltura(recipiente1, V_actual);
  let h2_curr = calcularAltura(recipiente2, V_actual);
  
  dibujarMesa(30, baseEjeY, 380, 140);
  
  let fluyendo = simulando && (V_actual < V_total);
  dibujarLlaveYChorro(120, baseEjeY, H, h1_curr, fluyendo);
  dibujarLlaveYChorro(320, baseEjeY, H, h2_curr, fluyendo);
  
  dibujarRecipiente(120, baseEjeY, H, h1_curr, recipiente1);
  fill(40, 120, 220);
  textSize(13);
  textAlign(CENTER);
  text("R1: " + obtenerNombreRecipiente(recipiente1) + "\nh = " + h1_curr.toFixed(1) + " px", 120, baseEjeY + 35);
  
  dibujarRecipiente(320, baseEjeY, H, h2_curr, recipiente2);
  fill(220, 60, 60);
  text("R2: " + obtenerNombreRecipiente(recipiente2) + "\nh = " + h2_curr.toFixed(1) + " px", 320, baseEjeY + 35);
  
  dibujarGrafico(480, 110, 380, 280);
  
  if (mostrarValidacion) {
    dibujarPanelRetroalimentacion(480, 405, 380, 145);
  } else {
    fill(255); stroke(200); strokeWeight(1);
    rect(480, 405, 380, 145, 8);
    fill(100); textSize(13); textAlign(CENTER, CENTER);
    text("Haz clic en el botón 'Validar Hipótesis' (arriba)\npara evaluar la precisión de tus trazos.", 480 + 380/2.0, 405 + 145/2.0);
  }
}

// --- GRAFICO EN TIEMPO REAL ---
function dibujarGrafico(x, y, w, h) {
  fill(255); stroke(200); strokeWeight(1);
  rect(x, y, w, h, 8);
  
  let x0 = x + 45, x1 = x + w - 15;
  let y0 = y + h - 35, y1 = y + 25;
  
  let divY = 8;
  let divX = 8;
  let t_max = V_total / Q;
  
  stroke(230); strokeWeight(1);
  for (let i = 0; i <= divY; i++) {
    let py = map(i, 0, divY, y0, y1);
    line(x0, py, x1, py);
    fill(90); textSize(10); textAlign(RIGHT, CENTER);
    text(floor(i * H / divY), x0 - 6, py);
  }
  
  for (let j = 0; j <= divX; j++) {
    let px = map(j, 0, divX, x0, x1);
    line(px, y0, px, y1);
    textAlign(CENTER, TOP);
    text(floor(j * t_max / divX), px, y0 + 6);
  }
  
  stroke(100); strokeWeight(2);
  line(x0, y0, x1, y0);
  line(x0, y0, x0, y1);
  
  fill(50); textSize(11); textAlign(CENTER);
  text("Tiempo (t)", (x0 + x1)/2, y0 + 22);
  textAlign(RIGHT);
  text("Altura h(t)", x0 - 25, y1);
  
  fill(40, 120, 220); text("R1: " + obtenerNombreRecipiente(recipiente1), x + w - 20, y + 20);
  fill(220, 60, 60);  text("R2: " + obtenerNombreRecipiente(recipiente2), x + w - 20, y + 35);
  
  dibujarTrazoNormalizado(boceto1, x0, x1, y0, y1, color(40, 120, 220, 90), 2);
  dibujarTrazoNormalizado(boceto2, x0, x1, y0, y1, color(220, 60, 60, 90), 2);
  
  if (t_hist.length > 1) {
    for (let i = 0; i < t_hist.length - 1; i++) {
      let px1 = map(t_hist[i], 0, t_max, x0, x1);
      let px2 = map(t_hist[i+1], 0, t_max, x0, x1);
      
      let py1_h1 = map(h1_hist[i], 0, H, y0, y1);
      let py2_h1 = map(h1_hist[i+1], 0, H, y0, y1);
      stroke(40, 120, 220); strokeWeight(2.5);
      line(px1, py1_h1, px2, py2_h1);
      
      let py1_h2 = map(h2_hist[i], 0, H, y0, y1);
      let py2_h2 = map(h2_hist[i+1], 0, H, y0, y1);
      stroke(220, 60, 60); strokeWeight(2.5);
      line(px1, py1_h2, px2, py2_h2);
    }
  }
}

// --- EVALUACION DE HIPOTESIS Y RETROALIMENTACION ---
function dibujarPanelRetroalimentacion(x, y, w, h) {
  fill(255); stroke(200); strokeWeight(1);
  rect(x, y, w, h, 8);
  
  fill(30); textSize(13); textAlign(LEFT, TOP);
  text("Evaluación de la Hipótesis", x + 15, y + 12);
  stroke(220); line(x + 15, y + 30, x + w - 15, y + 30);
  
  let e1 = calcularErrorBoceto(boceto1, recipiente1);
  let e2 = calcularErrorBoceto(boceto2, recipiente2);
  
  let mensaje = "";
  let colorMensaje = color(50);
  
  if (e1 < 0 && e2 < 0) {
    mensaje = "No realizaste un dibujo previo en la Pantalla 3.\n¡Vuelve atrás y traza tus hipótesis para comparar tus ideas con la física real!";
    colorMensaje = color(100);
  } else {
    let errorPromedio = 0;
    if (e1 >= 0 && e2 >= 0) errorPromedio = (e1 + e2) / 2.0;
    else if (e1 >= 0) errorPromedio = e1;
    else errorPromedio = e2;
    
    if (errorPromedio < 0.08) {
      mensaje = "¡Excelente! Tu aproximación de gráfica es muy similar a la curva teórica real.";
      colorMensaje = color(30, 140, 60);
    } else if (errorPromedio < 0.18) {
      mensaje = "¡Buena aproximación! Tu gráfica captura la tendencia principal de la curva real.";
      colorMensaje = color(200, 120, 20);
    } else {
      mensaje = "Tu gráfica no se parece mucho a la real, pero ¡muy bien por intentarlo! Observa cómo cambia la rapidez de llenado dh/dt según el área A(h).";
      colorMensaje = color(180, 40, 40);
    }
  }
  
  fill(colorMensaje);
  textSize(12);
  textAlign(LEFT, TOP);
  text(mensaje, x + 15, y + 40, w - 30, h - 50);
}

function calcularErrorBoceto(boceto, tipo) {
  if (!boceto || boceto.length === 0) return -1;
  let sumaError = 0;
  for (let p of boceto) {
    let u = constrain(p.x, 0, 1);
    let v_dibujo = constrain(p.y, 0, 1);
    
    let V_teorico = u * V_total;
    let h_teorica = calcularAltura(tipo, V_teorico);
    let v_teorico = h_teorica / H;
    
    sumaError += abs(v_dibujo - v_teorico);
  }
  return sumaError / boceto.length;
}

function dibujarTrazoNormalizado(pts, x0, x1, y0, y1, c, grosor) {
  if (pts.length < 2) return;
  stroke(c);
  strokeWeight(grosor);
  noFill();
  
  for (let i = 0; i < pts.length - 1; i++) {
    let p1 = pts[i];
    let p2 = pts[i+1];
    
    if (dist(p1.x, p1.y, p2.x, p2.y) > 0.15) continue;
    
    let px1 = map(p1.x, 0, 1, x0, x1);
    let py1 = map(p1.y, 0, 1, y0, y1);
    let px2 = map(p2.x, 0, 1, x0, x1);
    let py2 = map(p2.y, 0, 1, y0, y1);
    
    line(px1, py1, px2, py2);
  }
}

// ==========================================
// COMPONENTES DE INTERFAZ Y MODELADO FISICO
// ==========================================
function dibujarMesa(x, yBase, ancho, alto) {
  fill(170, 130, 90); stroke(110, 75, 45); strokeWeight(2);
  rect(x, yBase, ancho, 14, 3);
  fill(0, 20); noStroke();
  rect(x + 10, yBase + 14, ancho - 20, 6);
  fill(140, 100, 65); stroke(90, 60, 35); strokeWeight(2);
  rect(x + 20, yBase + 14, 16, alto - 14);
  rect(x + ancho - 36, yBase + 14, 16, alto - 14);
}

function dibujarLlaveYChorro(x, yBase, hTotal, hAgua, fluyendo) {
  let yLlave = yBase - hTotal - 35;
  if (fluyendo) {
    stroke(80, 170, 240, 210); strokeWeight(6);
    line(x, yLlave + 15, x, yBase - hAgua);
    stroke(200, 230, 255, 230); strokeWeight(2);
    line(x, yLlave + 15, x, yBase - hAgua);
  }
  stroke(80); strokeWeight(2);
  fill(160, 165, 170); rect(x - 6, yLlave - 18, 12, 22, 2);
  rect(x - 9, yLlave + 4, 18, 10, 2);
  fill(220, 60, 60); rect(x - 14, yLlave - 24, 28, 6, 2);
  fill(100); rect(x - 3, yLlave - 18, 6, 6);
}

function calcularAltura(tipo, V) {
  if (tipo === 0) return obtenerAlturaCilindro(V);
  if (tipo === 1) return obtenerAlturaConoInvertido(V);
  if (tipo === 2) return obtenerAlturaEsfera(V);
  if (tipo === 3) return obtenerAlturaPrisma(V);
  if (tipo === 4) return obtenerAlturaConoNormal(V);
  if (tipo === 5) return obtenerAlturaDobleCono(V);
  if (tipo === 6) return obtenerAlturaTetraedro(V);
  return 0;
}

function obtenerAlturaCilindro(V) { return H * (V / V_total); }
function obtenerAlturaConoInvertido(V) { return H * Math.pow(V / V_total, 1.0/3.0); }

function obtenerAlturaEsfera(V) {
  if (V >= V_total) return H;
  if (V <= 0) return 0;
  let u = constrain(V / V_total, 0.0001, 0.9999);
  let x = u;
  for (let i = 0; i < 10; i++) {
    let f = 3 * x * x - 2 * x * x * x - u;
    let df = 6 * x - 6 * x * x;
    if (abs(df) > 0.00001) x = x - f / df;
  }
  return H * constrain(x, 0, 1);
}

function obtenerAlturaPrisma(V) { return H * (V / V_total); }

function obtenerAlturaConoNormal(V) {
  let u = constrain(V / V_total, 0.0, 1.0);
  return H * (1.0 - Math.pow(1.0 - u, 1.0/3.0));
}

function obtenerAlturaDobleCono(V) {
  if (V <= V_total / 2.0) {
    let u = V / (V_total / 2.0);
    return (H / 2.0) * (1.0 - Math.pow(1.0 - u, 1.0/3.0));
  } else {
    let u = (V - V_total / 2.0) / (V_total / 2.0);
    return (H / 2.0) + (H / 2.0) * Math.pow(u, 1.0/3.0);
  }
}

function obtenerAlturaTetraedro(V) {
  let u = constrain(V / V_total, 0.0, 1.0);
  return H * (1.0 - Math.pow(1.0 - u, 1.0/3.0));
}

function obtenerNombreRecipiente(tipo) {
  switch(tipo) {
    case 0: return "Cilindro";
    case 1: return "Cono Invertido";
    case 2: return "Esfera";
    case 3: return "Prisma Rect.";
    case 4: return "Cono Normal";
    case 5: return "Doble Cono";
    case 6: return "Tetraedro";
    default: return "";
  }
}

// ==========================================
// DIBUJO GEOMETRICO EN PERSPECTIVA 3D
// ==========================================
function dibujarRecipiente(x, yBase, hTotal, hAgua, tipo) {
  if (tipo === 0) dibujarCilindro3D(x, yBase, hTotal, hAgua);
  else if (tipo === 1) dibujarConoInvertido3D(x, yBase, hTotal, hAgua);
  else if (tipo === 2) dibujarEsfera3D(x, yBase, hTotal, hAgua);
  else if (tipo === 3) dibujarPrisma3D(x, yBase, hTotal, hAgua);
  else if (tipo === 4) dibujarConoNormal3D(x, yBase, hTotal, hAgua);
  else if (tipo === 5) dibujarDobleCono3D(x, yBase, hTotal, hAgua);
  else if (tipo === 6) dibujarTetraedro3D(x, yBase, hTotal, hAgua);
}

function dibujarCilindro3D(x, yBase, hTotal, hAgua) {
  let r = sqrt(V_total / (PI * hTotal)) * 2.2;
  let rx = r, ry = r * 0.35;
  
  if (hAgua > 0) {
    fill(80, 160, 240, 180); noStroke();
    beginShape();
    vertex(x - rx, yBase); vertex(x + rx, yBase);
    vertex(x + rx, yBase - hAgua); vertex(x - rx, yBase - hAgua);
    endShape(CLOSE);
    ellipse(x, yBase, rx * 2, ry * 2);
    fill(120, 190, 255, 220);
    ellipse(x, yBase - hAgua, rx * 2, ry * 2);
  }
  
  stroke(60); strokeWeight(2); noFill();
  line(x - rx, yBase, x - rx, yBase - hTotal);
  line(x + rx, yBase, x + rx, yBase - hTotal);
  ellipse(x, yBase, rx * 2, ry * 2);
  ellipse(x, yBase - hTotal, rx * 2, ry * 2);
}

function dibujarConoInvertido3D(x, yBase, hTotal, hAgua) {
  let R = sqrt((3.0 * V_total) / (PI * hTotal)) * 2.2;
  let Rx = R, Ry = R * 0.35;
  let r_agua = R * (hAgua / hTotal);
  let rx_agua = r_agua, ry_agua = r_agua * 0.35;
  
  if (hAgua > 0) {
    fill(80, 160, 240, 180); noStroke();
    beginShape();
    vertex(x, yBase);
    vertex(x + rx_agua, yBase - hAgua);
    vertex(x - rx_agua, yBase - hAgua);
    endShape(CLOSE);
    fill(120, 190, 255, 220);
    ellipse(x, yBase - hAgua, rx_agua * 2, ry_agua * 2);
  }
  
  stroke(60); strokeWeight(2); noFill();
  line(x, yBase, x - Rx, yBase - hTotal);
  line(x, yBase, x + Rx, yBase - hTotal);
  ellipse(x, yBase - hTotal, Rx * 2, Ry * 2);
}

function dibujarEsfera3D(x, yBase, hTotal, hAgua) {
  let R = hTotal / 2.0;
  let yCentro = yBase - R;
  
  if (hAgua > 0) {
    let z = R - hAgua;
    let r_capa = sqrt(max(0, R*R - z*z));
    let rx_capa = r_capa;
    let ry_capa = r_capa * 0.35;
    
    fill(80, 160, 240, 180); noStroke();
    beginShape();
    for (let a = 0; a <= PI; a += 0.05) {
      let py = yBase - (hAgua * (1 + cos(a))/2.0);
      let z_i = R - (yBase - py);
      let r_i = sqrt(max(0, R*R - z_i*z_i));
      vertex(x + r_i, py);
    }
    for (let a = PI; a >= 0; a -= 0.05) {
      let py = yBase - (hAgua * (1 + cos(a))/2.0);
      let z_i = R - (yBase - py);
      let r_i = sqrt(max(0, R*R - z_i*z_i));
      vertex(x - r_i, py);
    }
    endShape(CLOSE);
    fill(120, 190, 255, 220);
    ellipse(x, yBase - hAgua, rx_capa * 2, ry_capa * 2);
  }
  
  stroke(60); strokeWeight(2); noFill();
  ellipse(x, yCentro, hTotal, hTotal);
  stroke(160); strokeWeight(1);
  ellipse(x, yCentro, hTotal, hTotal * 0.35);
}

function dibujarPrisma3D(x, yBase, hTotal, hAgua) {
  let w = 60, d = 25;
  
  if (hAgua > 0) {
    fill(80, 160, 240, 180); noStroke();
    rect(x - w/2, yBase - hAgua, w, hAgua);
    fill(60, 140, 220, 180);
    beginShape();
    vertex(x + w/2, yBase); vertex(x + w/2 + d, yBase - d*0.5);
    vertex(x + w/2 + d, yBase - hAgua - d*0.5); vertex(x + w/2, yBase - hAgua);
    endShape(CLOSE);
    fill(120, 190, 255, 220);
    beginShape();
    vertex(x - w/2, yBase - hAgua); vertex(x + w/2, yBase - hAgua);
    vertex(x + w/2 + d, yBase - hAgua - d*0.5); vertex(x - w/2 + d, yBase - hAgua - d*0.5);
    endShape(CLOSE);
  }
  
  stroke(60); strokeWeight(2); noFill();
  rect(x - w/2, yBase - hTotal, w, hTotal);
  line(x + w/2, yBase, x + w/2 + d, yBase - d*0.5);
  line(x + w/2, yBase - hTotal, x + w/2 + d, yBase - hTotal - d*0.5);
  line(x - w/2, yBase - hTotal, x - w/2 + d, yBase - hTotal - d*0.5);
  line(x + w/2 + d, yBase - d*0.5, x + w/2 + d, yBase - hTotal - d*0.5);
  line(x - w/2 + d, yBase - hTotal - d*0.5, x + w/2 + d, yBase - hTotal - d*0.5);
}

function dibujarConoNormal3D(x, yBase, hTotal, hAgua) {
  let R = sqrt((3.0 * V_total) / (PI * hTotal)) * 2.2;
  let Rx = R, Ry = R * 0.35;
  let r_top = R * (1.0 - hAgua / hTotal);
  let rx_top = r_top, ry_top = r_top * 0.35;
  
  if (hAgua > 0) {
    fill(80, 160, 240, 180); noStroke();
    beginShape();
    vertex(x - Rx, yBase); vertex(x + Rx, yBase);
    vertex(x + rx_top, yBase - hAgua); vertex(x - rx_top, yBase - hAgua);
    endShape(CLOSE);
    ellipse(x, yBase, Rx * 2, Ry * 2);
    fill(120, 190, 255, 220);
    ellipse(x, yBase - hAgua, rx_top * 2, ry_top * 2);
  }
  
  stroke(60); strokeWeight(2); noFill();
  line(x - Rx, yBase, x, yBase - hTotal);
  line(x + Rx, yBase, x, yBase - hTotal);
  ellipse(x, yBase, Rx * 2, Ry * 2);
}

function dibujarDobleCono3D(x, yBase, hTotal, hAgua) {
  let R = sqrt((3.0 * (V_total/2.0)) / (PI * (hTotal/2.0))) * 2.2;
  let Rx = R, Ry = R * 0.35;
  let hMitad = hTotal / 2.0;
  let rCuello = 6.0; 
  let rx_c = rCuello, ry_c = rCuello * 0.35;
  let yMitad = yBase - hMitad;
  
  if (hAgua <= hMitad) {
    let frac = hAgua / hMitad;
    let r_top = lerp(Rx, rCuello, frac);
    let rx_top = r_top, ry_top = r_top * 0.35;
    if (hAgua > 0) {
      fill(80, 160, 240, 180); noStroke();
      beginShape();
      vertex(x - Rx, yBase); vertex(x + Rx, yBase);
      vertex(x + rx_top, yBase - hAgua); vertex(x - rx_top, yBase - hAgua);
      endShape(CLOSE);
      ellipse(x, yBase, Rx * 2, Ry * 2);
      fill(120, 190, 255, 220);
      ellipse(x, yBase - hAgua, rx_top * 2, ry_top * 2);
    }
  } else {
    fill(80, 160, 240, 180); noStroke();
    beginShape();
    vertex(x - Rx, yBase); vertex(x + Rx, yBase);
    vertex(x + rx_c, yMitad); vertex(x - rx_c, yMitad);
    endShape(CLOSE);
    ellipse(x, yBase, Rx * 2, Ry * 2);
    ellipse(x, yMitad, rx_c * 2, ry_c * 2);
    
    let hSup = hAgua - hMitad;
    let frac = hSup / hMitad;
    let r_sup = lerp(rCuello, Rx, frac);
    let rx_sup = r_sup, ry_sup = r_sup * 0.35;
    beginShape();
    vertex(x - rx_c, yMitad); vertex(x + rx_c, yMitad);
    vertex(x + rx_sup, yBase - hAgua); vertex(x - rx_sup, yBase - hAgua);
    endShape(CLOSE);
    fill(120, 190, 255, 220);
    ellipse(x, yBase - hAgua, rx_sup * 2, ry_sup * 2);
  }
  
  stroke(60); strokeWeight(2); noFill();
  line(x - Rx, yBase, x - rx_c, yMitad); line(x + Rx, yBase, x + rx_c, yMitad);
  line(x - Rx, yBase - hTotal, x - rx_c, yMitad); line(x + Rx, yBase - hTotal, x + rx_c, yMitad);
  ellipse(x, yBase, Rx * 2, Ry * 2);
  ellipse(x, yBase - hTotal, Rx * 2, Ry * 2);
  
  stroke(40, 120, 220); strokeWeight(2);
  ellipse(x, yMitad, rx_c * 2 + 4, ry_c * 2 + 2);
  stroke(60); strokeWeight(1.5);
  ellipse(x, yMitad, rx_c * 2, ry_c * 2);
}

function dibujarTetraedro3D(x, yBase, hTotal, hAgua) {
  let R = 60;
  let r_agua = R * (1.0 - hAgua / hTotal);
  
  if (hAgua > 0) {
    fill(80, 160, 240, 180); noStroke();
    beginShape();
    vertex(x - R, yBase);
    vertex(x + R, yBase);
    vertex(x + r_agua, yBase - hAgua);
    vertex(x - r_agua, yBase - hAgua);
    endShape(CLOSE);
    
    fill(120, 190, 255, 220);
    beginShape();
    vertex(x - r_agua, yBase - hAgua);
    vertex(x + r_agua, yBase - hAgua);
    vertex(x, yBase - hAgua + r_agua * 0.25);
    endShape(CLOSE);
  }
  
  stroke(60); strokeWeight(2); noFill();
  triangle(x - R, yBase, x + R, yBase, x, yBase - hTotal);
  line(x, yBase + R*0.25, x - R, yBase);
  line(x, yBase + R*0.25, x + R, yBase);
  line(x, yBase + R*0.25, x, yBase - hTotal);
}

function dibujarBotonControl(x, y, w, h, etiqueta, c) {
  fill(c); stroke(180); strokeWeight(1);
  rect(x, y, w, h, 5);
  fill(40); textSize(12); textAlign(CENTER);
  text(etiqueta, x + w/2, y + h/2 + 4);
}

function reiniciarSimulacion() {
  simulando = false;
  V_actual = 0;
  t = 0;
  h1_hist = [];
  h2_hist = [];
  t_hist = [];
  mostrarValidacion = false;
}

function reiniciarTodo() {
  reiniciarSimulacion();
  prediccion = -1;
  boceto1 = [];
  boceto2 = [];
  curvaActiva = 1;
}

// ==========================================
// INTERACCION DE MOUSE
// ==========================================
function mousePressed() {
  if (pantalla === 1) {
    for (let i = 0; i < 7; i++) {
      let col = i % 4;
      let row = floor(i / 4);
      let cardX = 45 + col * 205;
      let cardY = 62 + row * 192;
      let cardW = 190;
      
      if (mouseX > cardX + 10 && mouseX < cardX + cardW/2 - 5 && mouseY > cardY + 120 && mouseY < cardY + 155) {
        recipiente1 = i;
        boceto1 = [];
      }
      if (mouseX > cardX + cardW/2 + 5 && mouseX < cardX + cardW - 10 && mouseY > cardY + 120 && mouseY < cardY + 155) {
        recipiente2 = i;
        boceto2 = [];
      }
    }
    if (mouseX > width/2 - 80 && mouseX < width/2 + 80 && mouseY > 480 && mouseY < 522) {
      pantalla = 2;
    }
  } else if (pantalla === 2) {
    for (let i = 0; i < 3; i++) {
      if (mouseX > width/2 - 200 && mouseX < width/2 + 200 && mouseY > 130 + i * 80 && mouseY < 185 + i * 80) {
        prediccion = i;
      }
    }
    if (prediccion !== -1 && mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > 420 && mouseY < 465) {
      pantalla = 3;
    }
  } else if (pantalla === 3) {
    if (mouseX > 30 && mouseX < 210 && mouseY > 80 && mouseY < 115) curvaActiva = 1;
    if (mouseX > 30 && mouseX < 210 && mouseY > 125 && mouseY < 160) curvaActiva = 2;
    if (mouseX > 30 && mouseX < 210 && mouseY > 170 && mouseY < 205) curvaActiva = 3;
    
    if (mouseX > 30 && mouseX < 210 && mouseY > 220 && mouseY < 250) boceto1 = [];
    if (mouseX > 30 && mouseX < 210 && mouseY > 260 && mouseY < 290) boceto2 = [];
    if (mouseX > 30 && mouseX < 210 && mouseY > 300 && mouseY < 330) { boceto1 = []; boceto2 = []; }
    
    let gx = 250, gy = 90, gw = 610, gh = 420;
    let x0 = gx + 55, x1 = gx + gw - 25;
    let y0 = gy + gh - 45, y1 = gy + 25;
    if (curvaActiva === 3 && mouseX >= x0 && mouseX <= x1 && mouseY >= y1 && mouseY <= y0) {
      let u = map(mouseX, x0, x1, 0, 1);
      let v = map(mouseY, y0, y1, 0, 1);
      aplicarBorrador(u, v);
    }
    
    if (mouseX > 30 && mouseX < 210 && mouseY > 420 && mouseY < 465) {
      mostrarValidacion = false;
      pantalla = 4;
    }
    
  } else if (pantalla === 4) {
    if (mouseX > 30 && mouseX < 120 && mouseY > 50 && mouseY < 80) simulando = !simulando;
    if (mouseX > 130 && mouseX < 220 && mouseY > 50 && mouseY < 80) reiniciarSimulacion();
    
    if (mouseX > 230 && mouseX < 320 && mouseY > 50 && mouseY < 80) {
      reiniciarTodo();
      pantalla = 1;
    }
    
    if (mouseX > 330 && mouseX < 460 && mouseY > 50 && mouseY < 80) {
      mostrarValidacion = !mostrarValidacion;
    }
    
    if (!simulando && V_actual === 0) {
      let handleX = map(H, 80, 220, sliderX, sliderX + sliderW);
      if (dist(mouseX, mouseY, handleX, sliderY) < 15) arrastrandoSlider = true;
    }
  }
}

function mouseReleased() {
  arrastrandoSlider = false;
}

function mouseDragged() {
  if (pantalla === 3) {
    let gx = 250, gy = 90, gw = 610, gh = 420;
    let x0 = gx + 55, x1 = gx + gw - 25;
    let y0 = gy + gh - 45, y1 = gy + 25;
    
    if (mouseX >= x0 && mouseX <= x1 && mouseY >= y1 && mouseY <= y0) {
      let u = map(mouseX, x0, x1, 0, 1);
      let v = map(mouseY, y0, y1, 0, 1);
      
      if (curvaActiva === 3) {
        aplicarBorrador(u, v);
      } else {
        let boceto = (curvaActiva === 1) ? boceto1 : boceto2;
        
        if (boceto.length > 0) {
          let ultimo = boceto[boceto.length - 1];
          if (dist(u, v, ultimo.x, ultimo.y) > 0.005) {
            boceto.push(createVector(u, v));
          }
        } else {
          boceto.push(createVector(u, v));
        }
      }
    }
  } else if (pantalla === 4) {
    if (arrastrandoSlider && !simulando && V_actual === 0) {
      let handleX = constrain(mouseX, sliderX, sliderX + sliderW);
      H = map(handleX, sliderX, sliderX + sliderW, 80, 220);
    }
  }
}

function aplicarBorrador(u, v) {
  borrarPuntosCercanos(boceto1, u, v);
  borrarPuntosCercanos(boceto2, u, v);
}

function borrarPuntosCercanos(boceto, u, v) {
  for (let i = boceto.length - 1; i >= 0; i--) {
    let p = boceto[i];
    if (dist(p.x, p.y, u, v) < radioBorrador) {
      boceto.splice(i, 1);
    }
  }
}
