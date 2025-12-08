interface MapItemProps {
  position: [number, number, number];
  size?: [number, number, number];
  collider?: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

const TABLE_POSITIONS: MapItemProps[] = [
  {
    position: [-11, -1, 13] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, 2.5] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, -7.5] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, -19] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [6.8, -1, -19] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, -1, -29] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [6.8, -1, -29] as [number, number, number],
    scale: 4 as number,
    rotation: [0, 0, 0] as [number, number, number],
  },
];

const WALL_POSITION: MapItemProps[] = [
  {
    position: [-4.35, 4.2, 20],
    size: [21.5, 0.3, 10.5],
    collider: [12.5, 4, 0.15],
    color: "#FFFFFF",
  },
  {
    position: [11.88, 4.2, 20],
    size: [10.95, 0.3, 10.5],
    collider: [0, 0, 0],
    color: "#000000",
  },
  {
    position: [-17.4, 4.2, 19.7],
    size: [0.5, 0.3, 10.5],
    collider: [0, 0, 0],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [17.5, 4.2, 19.4],
    size: [1.4, 0.3, 10.5],
    collider: [0, 0, 0],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [-17.4, 7.45, 7],
    size: [4.05, 0.3, 26],
    collider: [0, 0, 0],
    color: "#FFFFFF",
    rotation: [Math.PI / 2, Math.PI / 2, 0],
  },
  {
    position: [17.5, 7.4, 9.8],
    size: [4.1, 0.3, 18.52],
    collider: [0, 0, 0],
    color: "#FFFFFF",
    rotation: [Math.PI / 2, Math.PI / 2, 0],
  },
  {
    position: [-20.15, 4.2, 20],
    size: [10.3, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },

  {
    position: [19.4, 4.2, 20],
    size: [4, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, 0, 0],
  },
  {
    position: [24.5, 4.2, 20.9],
    size: [6, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, 0, 0],
  },
  {
    position: [21.5, 4.2, 20.45],
    size: [1.2, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [27.5, 4.2, 20.45],
    size: [1.2, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [28.4, 4.2, 20],
    size: [1.5, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, 0, 0],
  },
  {
    position: [29, 4.2, 20.45],
    size: [1.2, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [30.5, 4.2, 20.9],
    size: [3, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, 0, 0],
  },

  {
    position: [31.75, 4.2, 19.7],
    size: [2.2, 0.5, 10.5],
    color: "#EFB100",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [31.75, 4.2, 11.2],
    size: [2, 0.5, 10.5],
    color: "#EFB100",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [31.75, 0.3, 15.4],
    size: [2.5, 0.5, 6.5],
    color: "#EFB100",
    rotation: [Math.PI / 2, Math.PI / 2, 0],
  },
  {
    position: [31.75, 7.85, 15.4],
    size: [3.2, 0.5, 6.5],
    color: "#EFB100",
    rotation: [Math.PI / 2, Math.PI / 2, 0],
  },

  {
    position: [30.3, 4.2, 10.1],
    size: [3.4, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, 0, 0],
  },

  {
    position: [28.5, 4.2, 2],
    size: [16.5, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, Math.PI / 2, 0],
  },

  {
    position: [23.05, 4.2, -6.3],
    size: [11.2, 0.3, 10.5],
    color: "#EFB100",
    rotation: [0, 0, 0],
  },
  {
    position: [23, 4.2, -6.6],
    size: [11.3, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },
  {
    position: [17.58, 4.2, -2.95],
    size: [7, 0.15, 10.5],
    color: "#EFB100",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [17.428, 4.2, -2.95],
    size: [7, 0.15, 10.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },

  // Переговорные

  // Стенки между переговорными
  {
    position: [-22, 4.2, -6.95],
    size: [6.5, 0.2, 10.5],
    collider: [0, 0, 0],
    color: "#72de8b",
    rotation: [0, 0, 0],
  },
  {
    position: [-21.25, 4.2, -7.15],
    size: [8, 0.2, 10.5],
    collider: [0, 0, 0],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },

  {
    position: [-22, 4.2, 11.69],
    size: [6.5, 0.175, 10.5],
    collider: [0, 0, 0],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },
  {
    position: [-22, 4.2, 11.5],
    size: [6.5, 0.175, 10.5],
    collider: [0, 0, 0],
    color: "#193CB8",
    rotation: [0, 0, 0],
  },

  {
    position: [-21.35, 4.2, 2.68],
    size: [7.8, 0.2, 10.5],
    collider: [0, 0, 0],
    color: "#193CB8",
    rotation: [0, 0, 0],
  },
  {
    position: [-21.35, 4.2, 2.49],
    size: [7.8, 0.2, 10.5],
    collider: [0, 0, 0],
    color: "#72de8b",
    rotation: [0, 0, 0],
  },
  {
    position: [-17.4, 4.2, 2.59],
    size: [0.4, 0.2, 10.5],
    collider: [0, 0, 0],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },

  //Стенки с окнами
  {
    position: [-25.1, 0.3, 15.8],
    size: [8.7, 0.3, 2.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [-25.1, 0.3, 7],
    size: [9, 0.3, 2.5],
    color: "#193cb8",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [-25.1, 0.3, -2.26],
    size: [10, 0.3, 2.5],
    color: "#72de8b",
    rotation: [0, Math.PI / 2, 0],
  },

  //Задняяя часть

  {
    position: [-19, 0.3, -11.7],
    size: [9, 0.3, 2.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [-19, 5.5, -15.77],
    size: [0.85, 0.3, 7.9],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [3, 5.5, -33.8],
    size: [0.85, 0.3, 7.9],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },

  {
    position: [7, 0.3, -33.8],
    size: [9, 0.3, 2.5],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },

  {
    position: [11.4, 0.3, -36.65],
    size: [6, 0.3, 2.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [18.7, 0.3, -39.75],
    size: [14.9, 0.3, 2.5],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },
  {
    position: [26, 4.2, -36.65],
    size: [6, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },

  {
    position: [26, 4.2, -25.05],
    size: [17.8, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },

  // Кабинет Олега

  {
    position: [40.5, 0.3, -39.8],
    size: [30, 0.3, 2.5],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },
  {
    position: [36.3, 4.2, -18.3],
    size: [4.5, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [36.3, 4.2, -36.15],
    size: [7.5, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },

  {
    position: [55.5, 4.2, -28],
    size: [24, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },

  // Коридор

  {
    position: [42, 4.2, -2.5],
    size: [27, 0.3, 10.5],
    color: '#FFFFFF',
    rotation: [0,0,0],
  },
  {
    position: [28.8, 4.2, -4.55],
    size: [4.4, 0.3, 10.5],
    color: '#FFFFFF',
    rotation: [0,Math.PI / 2,0],
  },

  //Игровая

  {
    position: [61.5, 4.2, -39.85],
    size: [12, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },
  {
    position: [55.5, 4.2, -5.8],
    size: [6.5, 0.3,10.5],
    color: '#FFFFFF',
    rotation: [0, Math.PI / 2, 0]
  },
  {
    position: [67.5, 4.2, -24.5],
    size: [31.05, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [61.5, 4.2, -9.1],
    size: [12.3, 0.3, 10.5],
    color: "#FFFFFF",
    rotation: [0, 0, 0],
  },
];

const WINDOW_POSITIONS: MapItemProps[] = [
  {
    position: [-19.8, 1.6, -17],
    rotation: [0, 0.6, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-20.84, 1.6, -18.8],
    rotation: [0, 0.45, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-21.61, 1.6, -20.75],
    rotation: [0, 0.3, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-22.07, 1.6, -22.79],
    rotation: [0, 0.15, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-22.23, 1.6, -24.87],
    rotation: [0, 0, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-22.08, 1.6, -26.95],
    rotation: [0, -0.15, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-21.62, 1.6, -28.99],
    rotation: [0, -0.3, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-20.85, 1.6, -30.94],
    rotation: [0, -0.45, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-19.8, 1.6, -32.75],
    rotation: [0, -0.6, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-18.5, 1.6, -34.38],
    rotation: [0, -0.75, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-16.98, 1.6, -35.79],
    rotation: [0, -0.9, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-15.26, 1.6, -36.97],
    rotation: [0, -1.05, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-13.37, 1.6, -37.87],
    rotation: [0, -1.2, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-11.37, 1.6, -38.48],
    rotation: [0, -1.35, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-9.31, 1.6, -38.79],
    rotation: [0, -1.5, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-7.23, 1.6, -38.8],
    rotation: [0, -1.65, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-5.17, 1.6, -38.48],
    rotation: [0, -1.8, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-3.17, 1.6, -37.85],
    rotation: [0, -1.95, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-1.29, 1.6, -36.93],
    rotation: [0, -2.1, 0],
    scale: [20, 25, 19],
  },
  {
    position: [0.44, 1.6, -35.75],
    rotation: [0, -2.25, 0],
    scale: [20, 25, 19],
  },
  {
    position: [1.9, 1.6, -34.4],
    rotation: [0, -2.4, 0],
    scale: [20, 25, 18.5],
  },

  //Верхняя часть

  {
    position: [-19.8, 5.5, -17],
    rotation: [0, 0.6, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-20.84, 5.5, -18.8],
    rotation: [0, 0.45, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-21.61, 5.5, -20.75],
    rotation: [0, 0.3, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-22.07, 5.5, -22.79],
    rotation: [0, 0.15, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-22.23, 5.5, -24.87],
    rotation: [0, 0, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-22.08, 5.5, -26.95],
    rotation: [0, -0.15, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-21.62, 5.5, -28.99],
    rotation: [0, -0.3, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-20.85, 5.5, -30.94],
    rotation: [0, -0.45, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-19.8, 5.5, -32.75],
    rotation: [0, -0.6, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-18.5, 5.5, -34.38],
    rotation: [0, -0.75, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-16.98, 5.5, -35.79],
    rotation: [0, -0.9, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-15.26, 5.5, -36.97],
    rotation: [0, -1.05, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-13.37, 5.5, -37.87],
    rotation: [0, -1.2, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-11.37, 5.5, -38.48],
    rotation: [0, -1.35, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-9.31, 5.5, -38.79],
    rotation: [0, -1.5, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-7.23, 5.5, -38.8],
    rotation: [0, -1.65, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-5.17, 5.5, -38.48],
    rotation: [0, -1.8, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-3.17, 5.5, -37.85],
    rotation: [0, -1.95, 0],
    scale: [20, 25, 19],
  },
  {
    position: [-1.29, 5.5, -36.93],
    rotation: [0, -2.1, 0],
    scale: [20, 25, 19],
  },
  {
    position: [0.44, 5.5, -35.75],
    rotation: [0, -2.25, 0],
    scale: [20, 25, 19],
  },
  {
    position: [1.9, 5.5, -34.4],
    rotation: [0, -2.4, 0],
    scale: [20, 25, 18.5],
  },
  { position: [-25.1, 1.6, 18.8], scale: [20, 28, 19], color: "Black" },
  { position: [-25.1, 1.6, 16.8], scale: [20, 28, 19], color: "White" },
  { position: [-25.1, 1.6, 14.8], scale: [20, 28, 19], color: "White" },
  { position: [-25.1, 1.6, 12.8], scale: [20, 28, 19], color: "White" },
  {
    position: [-25.05, 6, 18.8],
    scale: [20, 27.5, 19],
    rotation: [0, 0, Math.PI / -5],
    color: "Black",
  },
  {
    position: [-25.05, 6, 16.8],
    scale: [20, 27.5, 19],
    rotation: [0, 0, Math.PI / -5],
    color: "White",
  },
  {
    position: [-25.05, 6, 14.8],
    scale: [20, 27.5, 19],
    rotation: [0, 0, Math.PI / -5],
    color: "White",
  },
  {
    position: [-25.05, 6, 12.8],
    scale: [20, 27.5, 19],
    rotation: [0, 0, Math.PI / -5],
    color: "White",
  },

  { position: [-25.1, 1.6, 10.3], scale: [20, 28, 20.5], color: "Black" },
  { position: [-25.1, 1.6, 8.15], scale: [20, 28, 20.5], color: "White" },
  { position: [-25.1, 1.6, 6], scale: [20, 28, 20.5], color: "White" },
  { position: [-25.1, 1.6, 3.85], scale: [20, 28, 20.5], color: "White" },
  {
    position: [-25.05, 6, 10.3],
    scale: [20, 27.5, 20.5],
    rotation: [0, 0, Math.PI / -5],
    color: "Black",
  },
  {
    position: [-25.05, 6, 8.15],
    scale: [20, 27.5, 20.6],
    rotation: [0, 0, Math.PI / -5],
    color: "White",
  },
  {
    position: [-25.05, 6, 6],
    scale: [20, 27.5, 20.5],
    rotation: [0, 0, Math.PI / -5],
    color: "White",
  },
  {
    position: [-25.05, 6, 3.85],
    scale: [20, 27.5, 20.5],
    rotation: [0, 0, Math.PI / -5],
    color: "White",
  },

  { position: [-25.1, 1.6, 1.2], scale: [20, 28, 21.5], color: "Black" },
  { position: [-25.1, 1.6, -1.05], scale: [20, 28, 21.5], color: "White" },
  { position: [-25.1, 1.6, -3.3], scale: [20, 28, 21.5], color: "White" },
  { position: [-25.1, 1.6, -5.55], scale: [20, 28, 21.5], color: "Black" },
  {
    position: [-25.05, 6, 1.2],
    scale: [20, 27.5, 21.5],
    rotation: [0, 0, Math.PI / -5],
    color: "Black",
  },
  {
    position: [-25.05, 6, -1.05],
    scale: [20, 27.5, 21.5],
    rotation: [0, 0, Math.PI / -5],
    color: "White",
  },
  {
    position: [-25.05, 6, -3.3],
    scale: [20, 27.5, 21.5],
    rotation: [0, 0, Math.PI / -5],
    color: "White",
  },
  {
    position: [-25.05, 6, -5.55],
    scale: [20, 27.5, 21.5],
    rotation: [0, 0, Math.PI / -5],
    color: "Black",
  },

  // Задняя часть
  { position: [-19, 1.6, -8.3], scale: [20, 25, 19], color: "Black" },
  { position: [-19, 1.6, -10.3], scale: [20, 25, 19], color: "Black" },
  { position: [-19, 1.6, -12.3], scale: [20, 25, 19], color: "Black" },
  { position: [-19, 1.6, -14.3], scale: [20, 25, 19], color: "Black" },
  { position: [-19, 5.5, -8.3], scale: [20, 25, 19], color: "Black" },
  { position: [-19, 5.5, -10.3], scale: [20, 25, 19], color: "Black" },
  { position: [-19, 5.5, -12.3], scale: [20, 25, 19], color: "Black" },
  { position: [-19, 5.5, -14.3], scale: [20, 25, 19], color: "Black" },

  // Основное пространство (центральная часть)
  {
    position: [4.5, 1.6, -33.8],
    scale: [20, 25, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },
  {
    position: [6.5, 1.6, -33.8],
    scale: [20, 25, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },
  {
    position: [8.5, 1.6, -33.8],
    scale: [20, 25, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },
  {
    position: [10.5, 1.6, -33.8],
    scale: [20, 25, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },

  {
    position: [11.4, 1.6, -34.8],
    scale: [20, 25, 19],
    rotation: [0, 0, 0],
    color: "White",
  },
  {
    position: [11.4, 1.6, -36.8],
    scale: [20, 25, 19],
    rotation: [0, 0, 0],
    color: "White",
  },
  {
    position: [11.4, 1.6, -38.8],
    scale: [20, 25, 19],
    rotation: [0, 0, 0],
    color: "White",
  },
  {
    position: [11.4, 5.5, -34.8],
    scale: [20, 25, 19],
    rotation: [0, 0, 0],
    color: "White",
  },
  {
    position: [11.4, 5.5, -36.8],
    scale: [20, 25, 19],
    rotation: [0, 0, 0],
    color: "White",
  },
  {
    position: [11.4, 5.5, -38.8],
    scale: [20, 25, 19],
    rotation: [0, 0, 0],
    color: "White",
  },

  {
    position: [12.5, 1.6, -39.75],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },
  {
    position: [14.5, 1.6, -39.75],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [16.5, 1.6, -39.75],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [18.5, 1.6, -39.75],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [20.5, 1.6, -39.75],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [22.5, 1.6, -39.75],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [24.72, 1.6, -39.75],
    scale: [20, 28, 21.5],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },

  {
    position: [12.5, 6, -39.75],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "Black",
  },
  {
    position: [14.5, 6, -39.75],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [16.5, 6, -39.75],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [18.5, 6, -39.75],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [20.5, 6, -39.75],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [22.5, 6, -39.75],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [24.72, 6, -39.75],
    scale: [20, 27.5, 21.5],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "Black",
  },

  {
    position: [4.5, 5.5, -33.8],
    scale: [20, 25, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },
  {
    position: [6.5, 5.5, -33.8],
    scale: [20, 25, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },
  {
    position: [8.5, 5.5, -33.8],
    scale: [20, 25, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },
  {
    position: [10.5, 5.5, -33.8],
    scale: [20, 25, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "Black",
  },

  // Кабинет Олега и коридор
  {
    position: [27.15, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [29.15, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [31.15, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [33.15, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [35.15, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },

  {
    position: [27.15, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [29.15, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [31.15, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [33.15, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [35.15, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },

  {
    position: [37.5, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [39.5, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [41.5, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [43.5, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [45.5, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [47.5, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [49.5, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [51.5, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [53.5, 1.6, -39.7],
    scale: [20, 28, 19],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },
  {
    position: [55, 1.6, -39.7],
    scale: [20, 28, 9.8],
    rotation: [0, Math.PI / 2, 0],
    color: "White",
  },

  {
    position: [37.5, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [39.5, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [41.5, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [43.5, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [45.5, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [47.5, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [49.5, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [51.5, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [53.5, 6, -39.7],
    scale: [20, 27.5, 19],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
  {
    position: [55, 6, -39.7],
    scale: [20, 27.5, 9.8],
    rotation: [0, Math.PI / 2, Math.PI / 5],
    color: "White",
  },
];

export { TABLE_POSITIONS, WALL_POSITION, WINDOW_POSITIONS };
