// const LMS2RGB = mat3x3<f32>(
//     vec3f(2.85847e+0, -1.62879e+0, -2.48910e-2),
//     vec3f(-2.10182e-1,  1.15820e+0,  3.24281e-4),
//     vec3f(-4.18120e-2, -1.18169e-1,  1.06867e+0)
// );

const LMS2RGB = mat3x3<f32>(
    vec3f( 0.0809444479,  -0.0102485335,  -0.000365296938),
    vec3f(-0.13050440,     0.0540193266,  -0.00412161469),
    vec3f( 0.116721066,   -0.113614708,    0.693511405)
);

fn lms2rgb(lms : vec3f) -> vec3f { return LMS2RGB * lms; }
