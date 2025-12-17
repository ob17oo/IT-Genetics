const WINDOW_CONFIG = [
  {
    color: "Black" as string,
    position: [-20, 1.6, 8.6] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [20, 25.5, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 1.6, 6.6] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [20, 25.5, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 1.6, 4.6] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [20, 25.5, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 1.6, 2.6] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [20, 25.5, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 1.6, 0.6] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [20, 25.5, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 1.6, -1.4] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [20, 25.5, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 1.6, -3.4] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [20, 25.5, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 1.6, -5.4] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [20, 25.5, 19] as [number, number, number],
  },
  {
    color: "Black" as string,
    position: [-20, 1.6, -7] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [20, 25.5, 10] as [number, number, number],
  },

  {
    color: "Black" as string,
    position: [-20, 5.7, 8.6] as [number, number, number],
    rotation: [0, 0, Math.PI / -5] as [number, number, number],
    scale: [20, 25, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 5.7, 6.6] as [number, number, number],
    rotation: [0, 0, Math.PI / -5] as [number, number, number],
    scale: [20, 25, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 5.7, 4.6] as [number, number, number],
    rotation: [0, 0, Math.PI / -5] as [number, number, number],
    scale: [20, 25, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 5.7, 2.6] as [number, number, number],
    rotation: [0, 0, Math.PI / -5] as [number, number, number],
    scale: [20, 25, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 5.7, 0.6] as [number, number, number],
    rotation: [0, 0, Math.PI / -5] as [number, number, number],
    scale: [20, 25, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 5.7, -1.4] as [number, number, number],
    rotation: [0, 0, Math.PI / -5] as [number, number, number],
    scale: [20, 25, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 5.7, -3.4] as [number, number, number],
    rotation: [0, 0, Math.PI / -5] as [number, number, number],
    scale: [20, 25, 19] as [number, number, number],
  },
  {
    color: "White" as string,
    position: [-20, 5.7, -5.4] as [number, number, number],
    rotation: [0, 0, Math.PI / -5] as [number, number, number],
    scale: [20, 25, 19] as [number, number, number],
  },
  {
    color: "Black" as string,
    position: [-20, 5.7, -7] as [number, number, number],
    rotation: [0, 0, Math.PI / -5] as [number, number, number],
    scale: [20, 25, 10] as [number, number, number],
  },
];

const WALL_CONFIGS = [
  {
    position: [-7, 3, 7.5] as [number, number, number],
    size: [14, 8, 0.2],
    color: "#F2F2F2" as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-20, 0.3, 1.1] as [number, number, number],
    size: [0.2, 2.5, 17.4],
    color: "#F2F2F2" as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-10, 4, -7.5] as [number, number, number],
    size: [20, 10, 0.2],
    color: "#F2F2F2" as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [14.5, 4, 7.5] as [number, number, number],
    size: [11, 10, 0.2],
    color: "#F2F2F2" as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [14.5, 4, -7.5] as [number, number, number],
    size: [11, 10, 0.2],
    color: "#F2F2F2" as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [20, 4, 0] as [number, number, number],
    size: [0.2, 10, 15],
    color: "#F2F2F2" as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-14, 3, 8.5] as [number, number, number],
    size: [0.2, 8, 2.2],
    color: "#F2F2F2" as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-10, 4, 9.7] as [number, number, number],
    size: [20, 10, 0.2],
    color: "#F2F2F2" as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [0, 4, 12.05] as [number, number, number],
    size: [4.9, 10, 0.2],
    color: "#F2F2F2" as string,
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [0, 3, 8.5] as [number, number, number],
    size: [2.2, 8, 0.2],
    color: "#F2F2F2" as string,
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [9, 4, 11] as [number, number, number],
    size: [7.2, 10, 0.2],
    color: "#F2F2F2" as string,
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [8.7, 4, 8.9] as [number, number, number],
    size: [3, 10, 0.4],
    color: "#F2F2F2" as string,
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [4.5, 4, 14.5] as [number, number, number],
    size: [9.2, 10, 0.2],
    color: "#F2F2F2" as string,
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [4.5, 4, -7.5] as [number, number, number],
    size: [9, 10, 0.2],
    color: "#0e1111",
    rotation: [0, 0, 0] as [number, number, number],
  },
];

const DOOR_CONFIGS = [
  {
    position: [-17, 1, -7.7] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-17, 1, 9.3] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-11, 1, 7.1] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [-3, 1, 7.1] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [18, 1, 7.1] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    position: [19.6, 1, 0] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
  {
    position: [8.6, 1, 12] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
];

const DIPLOMA_CONFIGS = [
  {
    position: [16.9, 4.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [13.7, 4.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [10.5, 4.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [14, 3, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [10.8, 3, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [15.5, 1.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
  {
    position: [10.5, 1.5, 7.1] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
    scale: 8 as number,
  },
];

export { DIPLOMA_CONFIGS, WALL_CONFIGS, DOOR_CONFIGS, WINDOW_CONFIG };
