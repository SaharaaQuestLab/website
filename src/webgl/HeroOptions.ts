export interface HeroOptions {
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
      centerHeight: number,
      sampleBase4Layer1: {
        [key in 'one' | 'two']: number
      }
    }
  }
  sky: {
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
  },
  sphere1: {
    radius: {
      [key in 'one' | 'two']: number
    },
    xCount: number,
    yCount: number,
    position: {
      [key in 'one' | 'two']: {
        x: number,
        y: number,
        z: number
      }
    },
    shaders: {
      camPosition: {
        [key in 'one' | 'two']: {
          x: number,
          y: number,
          z: number
        }
      }
    }
  },
  sphere2: {
    radius: {
      [key in 'one' | 'two']: number
    },
    xCount: number,
    yCount: number,
    position: {
      [key in 'one' | 'two']: {
        x: number,
        y: number,
        z: number
      }
    },
    shaders: {
      camPosition: {
        [key in 'one' | 'two']: {
          x: number,
          y: number,
          z: number
        }
      }
    }
  }
}


export const DesktopOptions: HeroOptions = {
  cameraPosition: {
    x: 0,
    y: 0.95,
    z: 4
  },
  dofEffect: {
    focusDistance: 4.5
  },
  ground: {
    xCount: 140,
    yCount: 140,
    position: {
      x: 0,
      y: -0.05,
      z: 0
    },
    shaders: {
      centerHeight: 4.5,
      sampleBase4Layer1: {
        one: 3.0,
        two: 8.0
      }
    }
  },
  sky: {
    xCount: 100,
    yCount: 100,
    position: {
      x: 0,
      y: 0.05,
      z: 0
    },
    shaders: {
      centerHeight: 2.5
    }
  },
  sphere1: {
    radius: {
      one: 0.25,
      two: 0.15
    },
    xCount: 24,
    yCount: 24,
    position: {
      one: {
        x: -1.0,
        y: 0.2,
        z: -0.7
      },
      two: {
        x: -0.7,
        y: 0.1,
        z: -1.4
      }
    },
    shaders: {
      camPosition: {
        one: {
          x: 0.9,
          y: 0.65,
          z: 4.0
        },
        two: {
          x: 0.5,
          y: 0.5,
          z: 4.0
        }
      }
    }
  },
  sphere2: {
    radius: {
      one: 0.15,
      two: 0.2
    },
    xCount: 24,
    yCount: 24,
    position: {
      one: {
        x: 0.6,
        y: 1.5,
        z: 0.2
      },
      two: {
        x: 0.6,
        y: 0.25,
        z: 0.3
      }
    },
    shaders: {
      camPosition: {
        one: {
          x: -0.6,
          y: -0.45,
          z: 4.0
        },
        two: {
          x: -0.6,
          y: 0.6,
          z: 4.0
        }
      }
    }
  }
}

export const MobileOptions: HeroOptions = {
  cameraPosition: {
    x: 0,
    y: 0.95,
    z: 7
  },
  dofEffect: {
    focusDistance: 7.0
  },
  ground: {
    xCount: 100,
    yCount: 100,
    position: {
      x: 0,
      y: -0.25,
      z: 0
    },
    shaders: {
      centerHeight: 6.0,
      sampleBase4Layer1: {
        one: 3.0,
        two: 8.0
      }
    }
  },
  sky: {
    xCount: 50,
    yCount: 50,
    position: {
      x: 0,
      y: 0.35,
      z: 0
    },
    shaders: {
      centerHeight: 4.5
    }
  },
  sphere1: {
    radius: {
      one: 0.35,
      two: 0.2
    },
    xCount: 32,
    yCount: 32,
    position: {
      one: {
        x: -0.8,
        y: -0.3,
        z: -0.1
      },
      two: {
        x: -0.4,
        y: -0.3,
        z: -0.1
      }
    },
    shaders: {
      camPosition: {
        one: {
          x: 0.2,
          y: 0.65,
          z: 4.0
        },
        two: {
          x: 0.2,
          y: 0.65,
          z: 4.0
        }

      }
    }
  },
  sphere2: {
    radius: {
      one: 0.2,
      two: 0.3
    },
    xCount: 24,
    yCount: 24,
    position: {
      one: {
        x: 0.6,
        y: 2.1,
        z: 0.2
      },
      two: {
        x: 0.65,
        y: -0.45,
        z: 0.2
      }
    },
    shaders: {
      camPosition: {
        one: {
          x: -0.4,
          y: -0.45,
          z: 4.0
        },
        two: {
          x: -0.4,
          y: 0.5,
          z: 4.0
        }
      }
    }
  }
}