import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import YouTube from 'react-youtube';

const YouTubeModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      closeIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      trigger={
        <Button primary icon>
          Video
        </Button>
      }>
      <Modal.Content>{open && <YouTube videoId={'C2vgICfQawE'} />}</Modal.Content>
    </Modal>
  );
};

const Help = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className='help--div'>
      <Button circular icon='help' color='blue' size='large' onClick={() => setOpen(!open)} />
      <Modal open={open} onClose={() => setOpen(false)} closeIcon>
        <Modal.Header>Conway's Game of Life</Modal.Header>
        <Modal.Content>
          <p>
            The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of
            square cells, each of which is in one of two possible states, live or dead, (or
            populated and unpopulated, respectively). Every cell interacts with its eight
            neighbours, which are the cells that are horizontally, vertically, or diagonally
            adjacent. At each step in time, the following transitions occur:
          </p>
          <ol>
            <li>
              Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            </li>
            <li>
              Any live cell with two or three live neighbours lives on to the next generation.
            </li>
            <li>
              Any live cell with more than three live neighbours dies, as if by overpopulation.
            </li>
            <li>
              Any dead cell with exactly three live neighbours becomes a live cell, as if by
              reproduction.
            </li>
          </ol>
          <p>
            The initial pattern constitutes the seed of the system. The first generation is created
            by applying the above rules simultaneously to every cell in the seed; births and deaths
            occur simultaneously, and the discrete moment at which this happens is sometimes called
            a tick. Each generation is a pure function of the preceding one. The rules continue to
            be applied repeatedly to create further generations.
          </p>
          <p>
            Source:{' '}
            <cite>
              <a
                href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'
                target='_blank'
                rel='noopener noreferrer'>
                Wikipedia
              </a>
            </cite>
          </p>
        </Modal.Content>
        <Modal.Actions>
          <YouTubeModal />
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Help;
