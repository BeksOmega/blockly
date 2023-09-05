
// import { IBlockDragger } from '../blockly';
// import * as registry from './registry.js';

// export class DeadBlockDragger implements IBlockDragger {
//   startDrag(currentDragDeltaXY: Coordinate, healStack: boolean) {
//     if (!eventUtils.getGroup()) {
//       eventUtils.setGroup(true);
//     }
//     this.fireDragStartEvent_();

//     // The z-order of blocks depends on their order in the SVG, so move the
//     // block being dragged to the front so that it will appear atop other blocks
//     // in the workspace.
//     this.draggingBlock_.bringToFront(true);

//     // During a drag there may be a lot of rerenders, but not field changes.
//     // Turn the cache on so we don't do spurious remeasures during the drag.
//     dom.startTextWidthCache();
//     this.workspace_.setResizesEnabled(false);
//     blockAnimation.disconnectUiStop();

//     if (this.shouldDisconnect_(healStack)) {
//       this.disconnectBlock_(healStack, currentDragDeltaXY);
//     }
//     this.draggingBlock_.setDragging(true);
//   }

//   endDrag(e: PointerEvent, currentDragDeltaXY: Coordinate) {
//     // Make sure internal state is fresh.
//     this.drag(e, currentDragDeltaXY);
//     this.dragIconData_ = [];
//     this.fireDragEndEvent_();

//     dom.stopTextWidthCache();

//     blockAnimation.disconnectUiStop();

//     const preventMove =
//       !!this.dragTarget_ &&
//       this.dragTarget_.shouldPreventMove(this.draggingBlock_);
//     let delta: Coordinate | null = null;
//     if (!preventMove) {
//       const newValues = this.getNewLocationAfterDrag_(currentDragDeltaXY);
//       delta = newValues.delta;
//     }

//     if (this.dragTarget_) {
//       this.dragTarget_.onDrop(this.draggingBlock_);
//     }

//     const deleted = this.maybeDeleteBlock_();
//     if (!deleted) {
//       // These are expensive and don't need to be done if we're deleting.
//       this.draggingBlock_.setDragging(false);
//       if (delta) {
//         // !preventMove
//         this.updateBlockAfterMove_();
//       } else {
//         // Blocks dragged directly from a flyout may need to be bumped into
//         // bounds.
//         bumpObjects.bumpIntoBounds(
//           this.draggingBlock_.workspace,
//           this.workspace_.getMetricsManager().getScrollMetrics(true),
//           this.draggingBlock_,
//         );
//       }
//     }
//     this.workspace_.setResizesEnabled(true);

//     eventUtils.setGroup(false);
//   }

// }

// registry.register(registry.Type.BLOCK_DRAGGER, registry.DEFAULT, DeadBlockDragger);
