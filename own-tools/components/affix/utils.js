import addEventListener from 'rc-util/lib/Dom/addEventListener';
// ======================== Observer ========================
const TRIGGER_EVENTS = [
    'resize',
    'scroll',
    'touchstart',
    'touchmove',
    'touchend',
    'pageshow',
    'load',
];
let observerEntities = [];
export function addObserveTarget(target, affix) {
    if (!target)
        return;
    let entity = observerEntities.find(item => item.target === target);
    if (entity) {
        entity.affixList.push(affix);
    }
    else {
        entity = {
            target,
            affixList: [affix],
            eventHandlers: {},
        };
        observerEntities.push(entity);
        // Add listener
        TRIGGER_EVENTS.forEach(eventName => {
            entity.eventHandlers[eventName] = addEventListener(target, eventName, (event) => {
                entity.affixList.forEach(affix => {
                    affix.updatePosition(event);
                });
            });
        });
    }
}
export function removeObserveTarget(affix) {
    const observerEntity = observerEntities.find(oriObserverEntity => {
        const hasAffix = oriObserverEntity.affixList.some(item => item === affix);
        if (hasAffix) {
            oriObserverEntity.affixList = oriObserverEntity.affixList.filter(item => item !== affix);
        }
        return hasAffix;
    });
    if (observerEntity && observerEntity.affixList.length === 0) {
        observerEntities = observerEntities.filter(item => item !== observerEntity);
        // Remove listener
        TRIGGER_EVENTS.forEach(eventName => {
            const handler = observerEntity.eventHandlers[eventName];
            if (handler && handler.remove) {
                handler.remove();
            }
        });
    }
}
export function getTargetRect(target) {
    return target !== window
        ? target.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };
}
