import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import star from './money.png'
import { useFunSwitch } from '../lib/SwitchContext';

function drawStar(ctx, x, y, spikes, outerRadius, innerRadius){
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    let cx = x;
    let cy = y;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function createCircle(width, height) {
    // Using width and height passed as parameters
    const margin = 100;
    const angle = Math.random() * Math.PI * 2;
    const spawnDistance = Math.max(width, height) / 2 + margin;
    const x = width / 2 + Math.cos(angle) * spawnDistance;
    const y = height / 2 + Math.sin(angle) * spawnDistance;
    const radius = 10 + Math.random() * 50;

    const newCircle = Matter.Bodies.circle(x, y, radius, {
        render: {
            sprite: {
                texture: star,
                xScale: radius * 2 / 196,
                yScale: radius * 2 / 196,
            }
        },
        friction: 0,
        frictionAir: 0.0,
        collisionCount: 0
    });

    const center = { x: width / 2, y: height / 2 };
    const toCenter = Matter.Vector.sub(center, newCircle.position);
    const direction = Matter.Vector.normalise(toCenter);
    const speed = (Math.random() * 2) + 1;
    //console.log(`Speed: ${speed}`);
    Matter.Body.setVelocity(newCircle, { x: direction.x * speed, y: direction.y * speed });
    newCircle.lifespan = 6000;
    return newCircle;
}

const BackgroundAnimation = () => {
    const sceneRef = useRef();  // Container for the renderer
    const engine = useRef(Matter.Engine.create());
    const renderRef = useRef(null);
    const bodiesRef = useRef([]);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const { isFunEnabled } = useFunSwitch();

    const isFunEnabledRef = useRef(isFunEnabled); // Ref for tracking isFunEnabled dynamically

    // Update the ref whenever isFunEnabled changes
    useEffect(() => {
        isFunEnabledRef.current = isFunEnabled;
    }, [isFunEnabled]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        engine.current.gravity.y = 0;
        engine.current.gravity.x = 0;
        let bodies = bodiesRef.current;
        
        const render = Matter.Render.create({
            element: sceneRef.current,
            engine: engine.current,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'hsl(var(--background))',
            }
        });
        renderRef.current = render;
        // Handling window resize
        const resizeHandler = () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
            render.options.width = window.innerWidth;
            render.options.height = window.innerHeight;
            render.bounds.max.x = window.innerWidth;
            render.bounds.max.y = window.innerHeight;
            Matter.Render.lookAt(render, {
                min: { x: 0, y: 0 },
                max: { x: window.innerWidth, y: window.innerHeight }
            });
        };
        window.addEventListener('resize', resizeHandler);

        // Mouse move listener
        render.canvas.addEventListener('mousemove', event => {
            const rect = render.canvas.getBoundingClientRect();
            //console.log(`Update MousePos: X: ${event.clientX - rect.left} Y: ${event.clientY - rect.top}`);
            mousePositionRef.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        });

        // Function to apply gravity between two bodies
        const applyGravityBetweenBodies = (bodyA, bodyB, G) => {
            if (!bodyA.parent || !bodyB.parent) return;
            const force = Matter.Vector.sub(bodyB.position, bodyA.position);
            const distance = Matter.Vector.magnitude(force);
            if (distance < 50) return;

            const direction = Matter.Vector.normalise(force);
            const gravityStrength = (G * bodyA.mass * bodyB.mass) / Math.pow(distance, 2);
            const gravity = Matter.Vector.mult(direction, gravityStrength);

            Matter.Body.applyForce(bodyA, bodyA.position, gravity);
            Matter.Body.applyForce(bodyB, bodyB.position, Matter.Vector.neg(gravity));
        };

        // Function to apply gravity towards the cursor
        const applyGravityToCursor = (body, cursorX, cursorY, G) => {
            if (!body.parent) return;
            const force = Matter.Vector.sub({ x: cursorX, y: cursorY }, body.position);
            const distance = Matter.Vector.magnitude(force);
            if (distance < 50) return;

            const direction = Matter.Vector.normalise(force);
            const gravityStrength = (G * body.mass) / Math.pow(distance, 2);
            const gravity = Matter.Vector.mult(direction, gravityStrength);

            Matter.Body.applyForce(body, body.position, gravity);
        };

        // Setup interval for gravity and rotation updates
        const intervalId = setInterval(() => {
            //console.log(`Bodycount: ${bodies.length}`);
            bodies.forEach((body, index) => {
                for (let j = index + 1; j < bodies.length; j++) {
                    if (bodies[index].parent && bodies[j].parent) {
                        applyGravityBetweenBodies(bodies[index], bodies[j], 0.1);
                    }
                }
                const mousePosition = mousePositionRef.current;
                //console.log(`Mouse Position: X: ${mousePosition.x} Y: ${mousePosition.y}`);
                applyGravityToCursor(body, mousePosition.x, mousePosition.y, -10.5);
                Matter.Body.setAngle(body, body.angle + 0.05); // Rotate the body slightly
            });
        }, 1000 / 60); // Run at approximately 60Hz

        const circleCreationInterval = setInterval(() => {
            //console.log(`Bodycount in creation: ${bodies.length}, Switch enabled ${isFunEnabledRef.current}`);
            if (bodies.length > 100 || !isFunEnabledRef.current)
                return;
            const newCircle = createCircle(window.innerWidth, window.innerHeight);
            Matter.World.add(engine.current.world, newCircle);
            bodies.push(newCircle);
        }, 100);

        Matter.Events.on(render, 'afterRender', function() {
            const ctx = render.context;
            // Only draw bodies that are still in the world
            Matter.Composite.allBodies(engine.current.world).forEach(body => {
                if (body.position) {
                    drawStar(ctx, body.position.x, body.position.y, 5, body.circleRadius, body.circleRadius / 2);
                }
            });
        });

        // Handle collisions
        Matter.Events.on(engine.current, 'collisionEnd', event => {
            const { pairs } = event;
            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                if (bodies.includes(bodyA) && bodies.includes(bodyB)) {
                    // Increment collision counts
                    bodyA.collisionCount = (bodyA.collisionCount || 0) + 1;
                    bodyB.collisionCount = (bodyB.collisionCount || 0) + 1;
        
                    // Check if either body has reached the collision limit
                    if (bodyA.collisionCount >= 5) {
                        Matter.World.remove(engine.current.world, bodyA);
                        bodies = bodies.filter(b => b !== bodyA); // Remove from array
                        //console.log("Body A has been removed after 5 collisions");
                    }
                    if (bodyB.collisionCount >= 5) {
                        Matter.World.remove(engine.current.world, bodyB);
                        bodies = bodies.filter(b => b !== bodyB); // Remove from array
                        //console.log("Body B has been removed after 5 collisions");
                    }
                }
            });
        });

        // Event listener to update and check lifespan
        Matter.Events.on(engine.current, 'beforeUpdate', event => {
            bodies.forEach(body => {
                if (body.lifespan !== undefined) {
                    body.lifespan -= 1;
                    if (body.lifespan <= 0) {
                        Matter.World.remove(engine.current.world, body);
                        bodies = bodies.filter(b => b !== body); // Remove from array
                        //console.log(`Body removed after expiry: ${body.id}`);
                    }
                }
            });
        });

        let lastUpdateTime = performance.now();
        const renderInterval = setInterval(() => {
          const currentTime = performance.now();
          const deltaTime = currentTime - lastUpdateTime;
          lastUpdateTime = currentTime;
        
          Matter.Engine.update(engine.current, deltaTime);
        }, 1000 / 250);
        // Start the engine and renderer
        Matter.Runner.run(engine.current);
        Matter.Render.run(render);
        // Cleanup function
        return () => {
            //console.info('Cleanup started');
            window.removeEventListener('resize', resizeHandler);
            clearInterval(intervalId);
            clearInterval(renderInterval);
            clearInterval(circleCreationInterval);
            Matter.Render.stop(render);
            render.canvas.remove();
        };
    }, []);

    return <div ref={sceneRef} />;
};

export default BackgroundAnimation;