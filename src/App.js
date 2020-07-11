import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import { Button, Grid, Segment, Form, Image, Popup } from 'semantic-ui-react';
import Help from './Help';
import logo from './logo.png';

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const speeds = {
  slow: 1000,
  medium: 500,
  fast: 100,
};

const boxSizes = {
  small: 0.8,
  large: 1.15,
};

const App = () => {
  const [numRows, setNumRows] = useState(30);
  const [numCols, setNumCols] = useState(30);
  const [boxSize, setBoxSize] = useState(boxSizes.large);
  const [gridWidth, setGridWidth] = useState(numRows);
  const [speed, setSpeed] = useState(speeds.medium);
  const [random] = useState(0.8);
  const [loading, setLoading] = useState(false);

  const [grid, setGrid] = useState(() => generateEmptyGrid(numRows, numCols));
  const [running, setRunning] = useState(false);

  const runningRef = useRef(null);
  runningRef.current = running;

  const speedRef = useRef(null);
  speedRef.current = speed;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    setGrid((g) =>
      produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      })
    );
    setTimeout(runSimulation, speedRef.current);
  }, [numCols, numRows]);

  function generateEmptyGrid() {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  }

  const generateRandomGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => (Math.random() > random ? 1 : 0)));
    }

    return rows;
  };

  const handleChange = (e, callback) => {
    let value = e.target.value;

    if (value.length > 1 && value[0] === '0') {
      callback(value.slice(1));
      return;
    }

    if (value === '') {
      callback(0);
    } else if (value <= 100) {
      callback(parseInt(value));
    } else {
      callback(100);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGridWidth(numCols);
    setGrid(generateEmptyGrid());
    runningRef.current = false;
    setRunning(false);
  };

  return (
    <Segment className='app'>
      <Image src={logo} style={{ margin: 'auto', width: '50%' }} />

      <Grid columns={2} stackable reversed='mobile vertically'>
        <Grid.Column width={3}>
          <Segment>
            <div style={{ margin: '10px auto', width: '100%' }}>
              <Button.Group vertical labeled icon>
                <Button
                  icon={running ? 'pause' : 'play'}
                  onClick={() => {
                    setRunning(!running);
                    if (!running) {
                      runningRef.current = true;
                      runSimulation();
                    }
                  }}
                  color={running ? 'red' : 'blue'}
                  content={running ? 'Stop' : 'Start'}
                />
                <Button
                  icon='random'
                  color='green'
                  onClick={() => setGrid(generateRandomGrid())}
                  content='Random'
                />
                <Button icon='dont' onClick={() => setGrid(generateEmptyGrid())} content='Clear' />
              </Button.Group>
            </div>
            <div style={{ margin: '10px auto', width: '100%' }}>
              <Popup
                content='Select size of cells'
                position='right center'
                trigger={
                  <Button.Group vertical>
                    <Button
                      active={boxSize === boxSizes.small}
                      onClick={() => setBoxSize(boxSizes.small)}>
                      Small
                    </Button>
                    <Button
                      active={boxSize === boxSizes.large}
                      onClick={() => setBoxSize(boxSizes.large)}>
                      Large
                    </Button>
                  </Button.Group>
                }
              />
            </div>
            <div style={{ margin: '10px auto', width: '100%' }}>
              <Popup
                content='Select speed of generations'
                position='right center'
                trigger={
                  <Button.Group vertical>
                    <Button active={speed === speeds.slow} onClick={() => setSpeed(speeds.slow)}>
                      Slow
                    </Button>
                    <Button
                      active={speed === speeds.medium}
                      onClick={() => setSpeed(speeds.medium)}>
                      Medium
                    </Button>
                    <Button active={speed === speeds.fast} onClick={() => setSpeed(speeds.fast)}>
                      Fast
                    </Button>
                  </Button.Group>
                }
              />
            </div>
            <Form onSubmit={handleSubmit}>
              <Popup
                content='Maximum size is 100'
                position='right center'
                trigger={
                  <Form.Field>
                    <label>Number of Rows</label>
                    <input
                      type='number'
                      placeholder='Default is 30'
                      value={numRows}
                      onChange={(e) => handleChange(e, setNumRows)}
                      max={100}
                    />
                  </Form.Field>
                }
              />
              <Popup
                content='Maximum size is 100'
                position='right center'
                trigger={
                  <Form.Field>
                    <label>Number of Columns</label>
                    <input
                      type='number'
                      placeholder='Default is 30'
                      value={numCols}
                      onChange={(e) => handleChange(e, setNumCols)}
                    />
                  </Form.Field>
                }
              />

              <Button type='submit' loading={loading}>
                Update Grid
              </Button>
              {loading && 'loading'}
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={13}>
          <div
            className='grid-body'
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridWidth}, ${boxSize}rem)`,
            }}>
            {grid.map((row, i) =>
              row.map((col, k) => (
                <div
                  onClick={() => {
                    const newGrid = produce(grid, (gridCopy) => {
                      gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    });
                    setGrid(newGrid);
                  }}
                  key={`${i}-${k}`}
                  style={{
                    height: `${boxSize}rem`,
                    width: `${boxSize}rem`,
                    border: '1px solid black',
                    backgroundColor: grid[i][k] ? 'pink' : null,
                  }}></div>
              ))
            )}
          </div>
        </Grid.Column>
      </Grid>
      <Help />
    </Segment>
  );
};

export default App;
