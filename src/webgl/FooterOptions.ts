export interface FooterOptions {
  cameraPosition: {
    x: number,
    y: number,
    z: number
  }
  dofEffect: {
    focusDistance: number
  },
  ground: {
    xCount: number,
    yCount: number,
    position: {
      x: number,
      y: number,
      z: number
    },
    shaders: {
      centerHeight: number
    }
  }
}


export const DesktopOptions: FooterOptions = {
  cameraPosition: {
    x: 0,
    y: 0.75,
    z: 4
  },
  dofEffect: {
    focusDistance: 4.3
  },
  ground: {
    xCount: 128,
    yCount: 128,
    position: {
      x: 0,
      y: -0.03,
      z: 0
    },
    shaders: {
      centerHeight: 4.5,
    }
  }
}

export const MobileOptions: FooterOptions = {
  cameraPosition: {
    x: 0,
    y: 0.95,
    z: 7
  },
  dofEffect: {
    focusDistance: 6.9
  },
  ground: {
    xCount: 80,
    yCount: 80,
    position: {
      x: 0,
      y: -0.2,
      z: 0
    },
    shaders: {
      centerHeight: 6.0,
    }
  }
}