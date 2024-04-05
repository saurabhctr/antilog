
        window.onload = function() {
            // Get the canvas element
            var canvas = document.getElementById("webgl-canvas");

            // Initialize WebGL context
            var gl = canvas.getContext("webgl");

            // Set the viewport to match the canvas dimensions
            gl.viewport(0, 0, canvas.width, canvas.height);

            // Define vertices for a simple cube
            var vertices = [
                // Front face
                -1.0, -1.0,  1.0,
                 1.0, -1.0,  1.0,
                 1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,

                // Back face
                -1.0, -1.0, -1.0,
                -1.0,  1.0, -1.0,
                 1.0,  1.0, -1.0,
                 1.0, -1.0, -1.0,

                // Top face
                -1.0,  1.0, -1.0,
                -1.0,  1.0,  1.0,
                 1.0,  1.0,  1.0,
                 1.0,  1.0, -1.0,

                // Bottom face
                -1.0, -1.0, -1.0,
                 1.0, -1.0, -1.0,
                 1.0, -1.0,  1.0,
                -1.0, -1.0,  1.0,

                // Right face
                 1.0, -1.0, -1.0,
                 1.0,  1.0, -1.0,
                 1.0,  1.0,  1.0,
                 1.0, -1.0,  1.0,

                // Left face
                -1.0, -1.0, -1.0,
                -1.0, -1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0,  1.0, -1.0
            ];

            // Define indices to form triangles
            var indices = [
                0, 1, 2,  0, 2, 3,    // Front face
                4, 5, 6,  4, 6, 7,    // Back face
                8, 9, 10, 8, 10, 11,  // Top face
                12, 13, 14, 12, 14, 15, // Bottom face
                16, 17, 18, 16, 18, 19, // Right face
                20, 21, 22, 20, 22, 23  // Left face
            ];

            // Create buffer for vertices
            var vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            // Create buffer for indices
            var indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

            // Define vertex shader code
            var vertexShaderCode = `
                attribute vec3 coordinates;
                void main(void) {
                    gl_Position = vec4(coordinates, 1.0);
                }
            `;

            // Create a vertex shader object
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexShaderCode);
            gl.compileShader(vertexShader);

            // Define fragment shader code
            var fragmentShaderCode = `
                void main(void) {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
            `;

            // Create a fragment shader object
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentShaderCode);
            gl.compileShader(fragmentShader);

            // Create shader program
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);

            // Bind vertex buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            var coord = gl.getAttribLocation(shaderProgram, "coordinates");
            gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(coord);

            // Draw the cube
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        };