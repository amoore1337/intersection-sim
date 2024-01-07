# Intersection Simulator

## Overview

This is a simple browser-based simulation of a traffic intersection.

The simulator operates on a serious of 'ticks'. The traffic light and vehicles perform
their 'move' on each tick. For example, the traffic light changes state every `X` ticks.
Vehicles move through the intersection a max of one space every tick.

The intersection is made up of a grid of cells that vehicles may move between, one cell
per tick. Only one vehicle can occupy a cell at a time. The intersection is composed of
roads. Each road is composed of lanes. A lan has a direction: 'left', 'straight', or 'right'.
Per the specifications, the interection has been configured to be four-way with a left, right
and two straight lanes.

The idea for the overall strategy came from an old video game I used to play, called
[Screeps](https://screeps.com/). Screeps is a sandbox game for programmers that operates on
a similar concept of turns/execution ticks. This structure establishes an organized order
of operations and allows for clear visual depictions of the simulation.

Generally, the vehicles are "defensive" in their driving. They won't proceed into the intersection
if the light is yellow and avoid entering the space of another vehicle. Left hand turns are a little
more agressive. They do look for oncoming traffic, but will work agressively around opposing left-turn
vehicles to aviod congesting the intersection.

## Running Instructions

**Option 1:** View Simulation at https://intersection-sim.moorenet.tech/

**Option 2:**: Run locally using the following instructions:

1. Checkout the codebase and install dependencies (`npm i`).
2. Build application with `npm run build`.
3. Serve application with `npm run preview`.
4. View in your browser at [http://localhost:4173/](http://localhost:4173/).

## TODO:

Given more time, I'd look to address a few shortcomings:

- Implement "smart" signals that stay green if no traffic is going the other way. Plumming
  for this is mostly in place, would mostly require refining the conditional logic.
- Make vehicle decision making smarter. Left and right turning vehicles could be
  smarter/more efficient.
- Allow vehicles to queue up beyond the spaces available on the grid.
- Code cleanup / Performance enhancements. There are a number of places where the code
  is intentionally explicit, but a little cumbersome. This could be refactored to be less
  lengthy and more organized. Also could reduce some expensive renders in the UI.
- Display simulation log. It's hard to follow what all vehicles are doing and what decisions
  are being made. Would be nice to have a human-readable log of what's going on.

## Usage Instructions

1. When the page loads, you will see an empty grid with 'Play' button in the top left.
2. You may adjust the max number of vehicles allowed to enter the intersection.
3. Click 'Play' to begin the simulation. Vehicles will be added gradually over time
   to random roads and lanes.
4. You can 'Pause' / 'Resume' the simulation at any time or cancel by clicking the 'Stop' button.
5. You can request to pause traffic to walk accross the intersection in the horizontal or
   vertical direction.

## Development

1. Checkout the codebase and install dependencies (`npm i`).
2. Spin up the dev server with `npm run dev`.
3. View in your browser at [http://localhost:5173](http://localhost:5173).
