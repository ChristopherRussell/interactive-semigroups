LoadPackage("semigroups");

SemigroupToJS := function(S)
    local D, R, L, compareHClasses, H, i, degree, D_ranks, R_kernels,
    comp, elm, ideals, L_images, structure, H_groups, out;
    D := List(GreensDClasses(S), Elements);;
    R := List(GreensDClasses(S), GreensRClasses);;
    L := List(GreensDClasses(S), GreensLClasses);;

    if IsTransformationSemigroup(S) then
        degree := DegreeOfTransformationSemigroup(S);;
        D_labels := List(D, d -> RankOfTransformation(Representative(d), degree));
        R_labels := List(R, d -> List(d, r -> KernelOfTransformation(Representative(r), degree)));
        L_labels := List(L, d -> List(d, l -> ImageSetOfTransformation(Representative(l), degree)));
    else
        D_labels := List(D, d -> "");
        R_labels := List(R, d -> List(d, r -> ""));
        L_labels := List(L, d -> List(d, l -> ""));
    fi;

    # Now we store H-classes in a particular order so that if we fill out the rows of a
    # D-class diagram from left to right and top to bottom the H-classes with the same
    # image set will be in the same column and those with the same kernel will be in the
    # same row. We also create a corresponding list with the structure description of
    # the group H-classes.
    compareHClasses := function(h1, h2)
        local l1, l2, r1, r2;
        l1 := GreensLClassOfElement(S, Representative(h1));
        l2 := GreensLClassOfElement(S, Representative(h2));
        r1 := GreensRClassOfElement(S, Representative(h1));
        r2 := GreensRClassOfElement(S, Representative(h2));

        return [Position(L, l1), Position(R, r1)] <
         [Position(L, l2), Position(R, r2)];
    end;
    H := [];
    for i in [1 .. Length(D)] do
        H[i] := ShallowCopy(GreensHClasses(GreensDClasses(S)[i]));
        comp := function(h1, h2)
            Print(h1, h2);
            return compareHClasses(h1, h2);
        end;
        Sort(H[i], comp);
    od;
    structure := function(h)
        if IsGroupHClass(h) then
            return StructureDescription(h);
        else
            return "";
        fi;
    end;
    H_labels := List(H, d -> List(d, structure));

    D := List(D, d -> List(d, e -> Position(Elements(S), e)));;
    R := List(R, d -> List(d, r -> List(r, e -> Position(Elements(S), e))));;
    L := List(L, d -> List(d, l -> List(l, e -> Position(Elements(S), e))));; 
    H := List(H, d -> List(d, h -> List(h, e -> Position(Elements(S), e))));

    # store ideals as lists of pointers to the elements they contain
    ideals := List(Ideals(S), i -> List(i, e -> Position(Elements(S), e)));

    # We will want to export the transformations as image lists, rather than
    # transformation objects.
    if IsTransformationSemigroup(S) then
        elm := List(Elements(S), e -> ImageListOfTransformation(e, 3));;
    else  # currently, else assumes S is a quotient of a transformation semigroup
        elm := List(Elements(S), e -> ImageListOfTransformation(Representative(e), 3));
    fi;
    
    out := Concatenation("{ D:", String(D), ",\n",
        "        R:", String(R), ",\n",
        "        L:", String(L), ",\n",
        "        H:", String(H), ",\n",
        "        elm:", String(elm), ",\n",
        "        D_labels:", String(D_labels), ",\n",
        "        R_labels:", String(R_labels), ",\n",
        "        L_labels:", String(L_labels), ",\n",
        "        H_labels:", String(H_labels), ",\n",
        "        ideals:", String(ideals), "\n");
    Append(out, "    }");
    return out;
end;

CongruenceLatticeToJS := function(S)
    local lat, quotients, map, i, classes, j, s, red, top, out;
    # Congruences, obtain quotient semigroups as transformation
    lat := LatticeOfCongruences(S);;
    quotients := List(CongruencesOfPoset(lat), cong -> S / cong);
    map := []; # quotient maps as maps [1 .. |S|] -> [1 .. |S/~|]
    for i in [1 .. Size(quotients)] do
        map[i] := [];
        classes := Elements(quotients[i]);
        for j in [1 .. Size(classes)] do
            for s in classes[j] do
                map[i][Position(S, s)] := j;
            od;
        od;
    od;

    red := DigraphReflexiveTransitiveReduction(lat);
    top := DigraphTopologicalSort(red);  # this tells us how to draw the lattice.

    out := "{ ";
    Append(out, Concatenation("top: ", String(top), ",\n"));
    Append(out, "        quotientSemigroups: {\n");
    for i in [1 .. Length(quotients)] do
        Append(out, Concatenation("semi", String(i), ": "));
        Append(out, SemigroupToJS(quotients[i]));
        if i < Length(quotients) then
            Append(out, ",");
        fi;
        Append(out, "\n");
    od;
    Append(out, "        }\n");
    Append(out, "    }");
    return out;
end;

ExportSemigroupData := function(S)
    local f, out;

    f := IO_File("/Users/crussell/Desktop/Semigroup_Visualiser/semigroupData.js", "w");;
    out := "export let semigroupData = {\n    semigroup: ";
    Append(out, SemigroupToJS(S));
    Append(out, ",\n    lattice: ");
    Append(out, CongruenceLatticeToJS(S));
    Append(out, "\n}");

    IO_Write(f, out);;
    IO_Close(f);; 
end;