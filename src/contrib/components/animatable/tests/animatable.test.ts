import { Animatable } from '../index';
import { GroupState } from '../group-state';
import { IndividualState } from '../individual-state';
import { TwoDimensionalProps } from '../two-dimensional-props';
import { MessageConditionProps } from '../message-condition-props';
import { ComparatorConditionProps } from '../comparator-condition-props';
import animationExample from './jsons/animation-example.json';

describe('Contrib -> components -> Animatable', () => {
  it('Returns correct initial state', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    expect(animatable.currentState).toEqual(animatable.states[0]);

    expect(animatable.duration).toEqual(0);
  });

  it('Returns correct states ', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    expect(animatable.states.length).toEqual(3);

    expect(animatable.states[0].name).toEqual('idle');
    expect(animatable.states[0].speed).toEqual(0.5);
    expect(animatable.states[0].type).toEqual('group');
    expect(animatable.states[0].transitions.length).toEqual(3);

    expect(animatable.states[1].name).toEqual('run');
    expect(animatable.states[1].speed).toEqual(1);
    expect(animatable.states[1].type).toEqual('group');
    expect(animatable.states[1].transitions.length).toEqual(2);

    expect(animatable.states[2].name).toEqual('death');
    expect(animatable.states[2].speed).toEqual(1);
    expect(animatable.states[2].type).toEqual('individual');
    expect(animatable.states[2].transitions.length).toEqual(0);
  });

  it('Returns correct group state', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    const currentState = animatable.currentState as GroupState;

    expect(currentState.pickMode).toEqual('2D');

    const pickProps = currentState.pickProps as TwoDimensionalProps;
    expect(pickProps.x).toEqual(['viewDirection', 'x']);
    expect(pickProps.y).toEqual(['viewDirection', 'y']);
  });

  it('Returns correct individual state', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    const individualState = animatable.states[2] as IndividualState;

    expect(individualState.timeline.frames.length).toEqual(4);
    expect(individualState.timeline.looped).toEqual(false);
  });

  it('Returns correct transitions', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    const currentState = animatable.currentState as GroupState;

    const transition1 = currentState.transitions?.[0];
    expect(transition1.state).toEqual('death');
    expect(transition1.time).toEqual(0);

    const transition2 = currentState.transitions?.[1];
    expect(transition2.state).toEqual('run');
    expect(transition2.time).toEqual(0);
  });

  it('Returns correct conditions', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    const currentState = animatable.currentState as GroupState;
    const transition1 = currentState.transitions?.[0];
    const transition2 = currentState.transitions?.[1];

    const condition1 = transition1.conditions?.[0];
    expect(condition1.type).toEqual('message');

    const condition1Props = condition1.props as MessageConditionProps;
    expect(condition1Props.message).toEqual('DEATH');

    const condition2 = transition2.conditions?.[0];
    expect(condition2.type).toEqual('comparator');

    const condition2Props = condition2.props as ComparatorConditionProps;
    expect(condition2Props.operation).toEqual('notEquals');
    expect(condition2Props.arg1.type).toEqual('componentValue');
    expect(condition2Props.arg1.value).toEqual(['movement', 'vector', 'x']);
    expect(condition2Props.arg2.type).toEqual('number');
    expect(condition2Props.arg2.value).toEqual(0);
  });

  it('Returns correct group state\'s substates', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    const currentState = animatable.currentState as GroupState;

    expect(currentState.substates.length).toEqual(4);

    const substate1 = currentState.substates[0];
    expect(substate1.name).toEqual('idleRight');
    expect(substate1.x).toEqual(1);
    expect(substate1.y).toEqual(0);
    expect(substate1.timeline.looped).toEqual(true);
    expect(substate1.timeline.frames.length).toEqual(3);

    const substate2 = currentState.substates[1];
    expect(substate2.name).toEqual('idleLeft');
    expect(substate2.x).toEqual(-1);
    expect(substate2.y).toEqual(0);
    expect(substate2.timeline.looped).toEqual(true);
    expect(substate2.timeline.frames.length).toEqual(3);

    const substate3 = currentState.substates[2];
    expect(substate3.name).toEqual('idleTop');
    expect(substate3.x).toEqual(0);
    expect(substate3.y).toEqual(-1);
    expect(substate3.timeline.looped).toEqual(true);
    expect(substate3.timeline.frames.length).toEqual(3);

    const substate4 = currentState.substates[3];
    expect(substate4.name).toEqual('idleBottom');
    expect(substate4.x).toEqual(0);
    expect(substate4.y).toEqual(1);
    expect(substate4.timeline.looped).toEqual(true);
    expect(substate4.timeline.frames.length).toEqual(3);
  });

  it('Returns correct substate timeline\'s frames', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    const currentState = animatable.currentState as GroupState;
    const substate1 = currentState.substates[0];
    const substate2 = currentState.substates[1];
    const substate3 = currentState.substates[2];
    const substate4 = currentState.substates[3];

    const frames1 = substate1.timeline.frames;
    expect(frames1[0].index).toEqual(0);
    expect(frames1[0].flipX).toEqual(false);
    expect(frames1[1].index).toEqual(1);
    expect(frames1[1].flipX).toEqual(false);
    expect(frames1[2].index).toEqual(2);
    expect(frames1[2].flipX).toEqual(false);

    const frames2 = substate2.timeline.frames;
    expect(frames2[0].index).toEqual(0);
    expect(frames2[0].flipX).toEqual(true);
    expect(frames2[1].index).toEqual(1);
    expect(frames2[1].flipX).toEqual(true);
    expect(frames2[2].index).toEqual(2);
    expect(frames2[2].flipX).toEqual(true);

    const frames3 = substate3.timeline.frames;
    expect(frames3[0].index).toEqual(6);
    expect(frames3[1].index).toEqual(7);
    expect(frames3[2].index).toEqual(8);

    const frames4 = substate4.timeline.frames;
    expect(frames4[0].index).toEqual(3);
    expect(frames4[1].index).toEqual(4);
    expect(frames4[2].index).toEqual(5);
  });

  it('Correct updates current state', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    animatable.updateCurrentState('death');

    expect(animatable.currentState).toEqual(animatable.states[2]);
  });

  it('Correct updates duration', () => {
    const animatable = new Animatable('animatable', {
      ...animationExample,
    }).clone();

    animatable.duration += 1000;

    expect(animatable.duration).toEqual(1000);
  });

  it('Clones return deep copy of original component', () => {
    const originalAnimatable = new Animatable('animatable', {
      ...animationExample,
    });
    const cloneAnimatable = originalAnimatable.clone();

    expect(originalAnimatable.currentState).not.toBe(cloneAnimatable.currentState);
    expect(originalAnimatable.states).not.toBe(cloneAnimatable.states);

    const originalState1 = originalAnimatable.states[0];
    const originalState2 = originalAnimatable.states[1];
    const originalState3 = originalAnimatable.states[2];
    const cloneState1 = cloneAnimatable.states[0];
    const cloneState2 = cloneAnimatable.states[1];
    const cloneState3 = cloneAnimatable.states[2];

    expect(originalState1).not.toBe(cloneState1);
    expect(originalState2).not.toBe(cloneState2);
    expect(originalState3).not.toBe(cloneState3);

    expect(originalState1.transitions).not.toBe(cloneState1.transitions);
    expect(originalState2.transitions).not.toBe(cloneState2.transitions);
    expect(originalState3.transitions).not.toBe(cloneState3.transitions);

    expect(originalState1.transitions[0]).not.toBe(cloneState1.transitions[0]);
    expect(originalState1.transitions[1]).not.toBe(cloneState1.transitions[1]);
    expect(originalState1.transitions[2]).not.toBe(cloneState1.transitions[2]);

    expect(originalState1.transitions[0].conditions).not.toBe(
      cloneState1.transitions[0].conditions,
    );
    expect(originalState1.transitions[1].conditions).not.toBe(
      cloneState1.transitions[1].conditions,
    );
    expect(originalState1.transitions[2].conditions).not.toBe(
      cloneState1.transitions[2].conditions,
    );

    expect(originalState1.transitions[0].conditions[0]).not.toBe(
      cloneState1.transitions[0].conditions[0],
    );

    expect(originalState1.transitions[0].conditions[0].props).not.toBe(
      cloneState1.transitions[0].conditions[0].props,
    );
    expect(originalState1.transitions[1].conditions[0].props).not.toBe(
      cloneState1.transitions[1].conditions[0].props,
    );
    expect(originalState1.transitions[2].conditions[0].props).not.toBe(
      cloneState1.transitions[2].conditions[0].props,
    );

    expect(
      (originalState1.transitions[1].conditions[0].props as ComparatorConditionProps).arg1,
    ).not.toBe(
      (cloneState1.transitions[1].conditions[0].props as ComparatorConditionProps).arg1,
    );
    expect(
      (originalState1.transitions[1].conditions[0].props as ComparatorConditionProps).arg2,
    ).not.toBe(
      (cloneState1.transitions[1].conditions[0].props as ComparatorConditionProps).arg2,
    );

    expect((originalState3 as IndividualState).timeline).not.toBe(
      (cloneState3 as IndividualState).timeline,
    );
    expect((originalState3 as IndividualState).timeline.frames).not.toBe(
      (cloneState3 as IndividualState).timeline.frames,
    );
    expect((originalState3 as IndividualState).timeline.frames[0]).not.toBe(
      (cloneState3 as IndividualState).timeline.frames[0],
    );

    expect((originalState1 as GroupState).pickProps).not.toBe(
      (cloneState1 as GroupState).pickProps,
    );
    expect((originalState1 as GroupState).substates).not.toBe(
      (cloneState1 as GroupState).substates,
    );
    expect((originalState1 as GroupState).substates[0]).not.toBe(
      (cloneState1 as GroupState).substates[0],
    );
    expect((originalState1 as GroupState).substates[0].timeline).not.toBe(
      (cloneState1 as GroupState).substates[0].timeline,
    );
    expect((originalState1 as GroupState).substates[0].timeline.frames).not.toBe(
      (cloneState1 as GroupState).substates[0].timeline.frames,
    );
    expect((originalState1 as GroupState).substates[0].timeline.frames[0]).not.toBe(
      (cloneState1 as GroupState).substates[0].timeline.frames[0],
    );
  });
});
