# Intersection Simulator

## Overview

This is a simple browser-based simulation of a traffic intersection.

The simulator operates on a series of 'ticks'. The traffic light and vehicles perform
their 'move' on each tick. For example, the traffic light changes state every `X` ticks.
Vehicles move through the intersection a max of one space every tick.

The intersection is made up of a grid of cells that vehicles may move between, one cell
per tick. Only one vehicle can occupy a cell at a time. The intersection is composed of
roads. Each road is composed of lanes. A lane has a direction: 'left', 'straight', or 'right'.
Vehicles are placed in a lane. Per the specifications, the intersection has been configured to
be four-ways, with a left, right, and two straight lanes.

The idea for the overall strategy came from an old video game I used to play called
[Screeps](https://screeps.com/). Screeps is a sandbox game for programmers that operates on
a similar concept of turns/execution ticks. This structure establishes an organized order
of operations and allows for clear visual depictions of the simulation.

Generally, the vehicles are "defensive" in their driving. They won't proceed into the intersection
if the light is yellow and avoid entering the space of another vehicle. Left-hand turns are a little
more aggressive. They do look for oncoming traffic but will work aggressively around opposing left-turn
vehicles to avoid congesting the intersection.

## Structure

Modeling an intersection naturally lent itself to a more Object-Oriented design pattern. This makes
using JS / React a less than-obvious choice. However, the flexibility of JS and the composability of
UIs in React made this an intriguing path. The project is composed of objects and business rules contained
in the `models` directory. The models have the following relations:

- `Sumulation`: Responsible for managing program 'ticks' and the flow of the simulation. `Simulation` is
  a singleton instance within the app and creates/holds an instance of an `Intersection`.
- `Intersection`: Stitches together the various pieces of an intersection and controls the rate in which
  vehicles enter. An `Intersection` holds instances to the `Grid`, `TrafficLight`, and `Road`s making up
  the intersection.
- `Grid`: The 'board' in which the simulation is played on. Vehicles move through the grid, one cell at
  a time, to simulate the flow of traffic. `Grid` is responsible for storing the location of every vehicle
  and facilitating movement through cells.
- `TrafficLight`: The series of signals controlling the flow of traffic in the intersection. `TrafficLight`
  is composed of a list of explicit 'states' describing the pattern that signals transition through.
- `Road`: Specifies the direction a collection of lanes is facing. Specifically, a `Road` can be facing
  North (Up), South (Down), East (Right), West (Left). `Road` holds a list of `Lane` objects.
- `Lane`: Specifies the more granular direction for traffic. Combined with its associated `Road`, a lane
  determines the exact origin and destination for any `Vehicle` placed within it.
- `Vehicle`: Then object depicting a vehicle traveling through an intersection. A `Vehicle` is assigned
  to a lane and is responsible for the business logic of safely maneuvering through the `Intersection`/`Grid`.

The UI structure is pretty basic:

- `App`: Entry point for the UI. Holds the stateful instance of the `Intersection` which is used to govern
  the 'Start'/'Stop' state of the simulation.
- `TrafficLight`: UI depicting the `TrafficLight` model. The component registers a callback with the model
  to update the UI state every time the signal changes.
- `Controls`: Very basic UI for controlling the simulation.
- `Grid`: Visually depicts the position of every `Vehicle` within the `Intersection`. `Grid` registers a
  callback with the `simulation` instance to render on every 'tick'.

## Running Instructions

**Option 1:** View Simulation at https://intersection-sim.moorenet.tech/

**Option 2:** Run locally using the following instructions:

1. Checkout the codebase and make sure Node v18 is installed.
2. Run the application with `npm run demo`.
3. View in your browser at [http://localhost:4173/](http://localhost:4173/).

## TODO:

Given more time, I'd look to address a few shortcomings:

- Implement "smart" signals that stay green if no traffic is going the other way. Plumming
  for this is mostly in place, would mostly require refining the conditional logic.
- Make vehicle decision making smarter. Left and right turning vehicles could be
  smarter/more efficient.
- Allow vehicles to queue up beyond the spaces available on the grid.
- Code cleanup / Refactor. There are a number of places where the code is intentionally explicit,
  but a little cumbersome. This could be refactored to be lesslengthy and more organized. Some of
  the object relationships are a tad messy. I would like to better organize and strengthen their
  boundaries. The UI's grid is also an expensive render on every 'tick'. While fine at this scale,
  the UI could become sluggish with larger roads or number of vehicles. It would be beneficial to
  to localize some of the state changes/renders more to improve performance.
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

1. Checkout the codebase and install dependencies (`npm i`) with Node v18 installed.
2. Spin up the dev server with `npm run dev`.
3. View in your browser at [http://localhost:5173](http://localhost:5173).
