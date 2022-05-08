pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib-matrix/circuits/matMul.circom"; // hint: you can use more than one templates in circomlib-matrix to help you
include "../../node_modules/circomlib-matrix/circuits/matSub.circom";
include "../../node_modules/circomlib-matrix/circuits/matElemSum.circom";

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    component isequal = IsEqual();
    component matmul = matMul(1,n,n);
    component matsub = matSub(1,n);
    component matelemsum = matElemSum(1,n);
    //var xv[1][n]; var bv[1][n]; 
    for (var i = 0;i<n;i++) {
        matmul.a[0][i] <== x[i];
        for (var j=0; j<n; j++) {
            matmul.b[j][i] <== A[j][i];
        }
    }
    for (var i=0; i<n; i++) {
        matsub.a[0][i] <== matmul.out[0][i];
        matsub.b[0][i] <== b[i];
    }
    for (var i=0; i<n; i++) {
        matelemsum.a[0][i] <== matsub.out[0][i];
    }
    
    isequal.in[0] <== 0;
    isequal.in[1] <== matelemsum.out;
    out <== isequal.out;

}

component main {public [A, b]} = SystemOfEquations(3);